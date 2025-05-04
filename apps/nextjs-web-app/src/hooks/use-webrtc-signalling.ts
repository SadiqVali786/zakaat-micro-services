/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Peer from "peerjs";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";
import {
  WebRTCSignallingServerMessages,
  DifferentWebRTCSignallingServerMessages,
  WebRTCCallStatus
} from "@repo/common/types";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@/config/path.config";

export const useWebRTCSignaling = () => {
  const { data: session, status } = useSession();
  const { setPeer, setSocket, callStatus, setRemotePeerId, resetCall } = useVideoCallStore();
  const router = useRouter();

  useEffect(() => {
    if (!session?.jwtToken) return;

    let ws: WebSocket | null = null;
    let reconnectAttempt = 0;
    let reconnectTimeout: NodeJS.Timeout;
    let peer: Peer | null = null;

    const connect = () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_WEB_RTC_SIGNALLING_SERVER_BE_URL?.replace("https", "wss")}?token=${session.jwtToken}`;
        console.log("Connecting to WebRTC Signaling Server", url);
        ws = new WebSocket(url);

        // Initialize PeerJS
        peer = new Peer();
        setPeer(peer);

        ws.onopen = () => {
          console.log("WebRTC Signaling Server Connected");
          reconnectAttempt = 0; // Reset reconnection attempts on successful connection
          setSocket(ws);
        };

        ws.onclose = () => {
          console.log("WebRTC Signaling connection closed. Attempting to reconnect...");
          // Calculate reconnection delay with exponential backoff (max 1 second)
          const delay = Math.min(100 * Math.pow(1.5, reconnectAttempt), 1000);
          reconnectAttempt++;

          // Cleanup old peer connection before reconnecting
          peer?.destroy();
          reconnectTimeout = setTimeout(connect, delay);
        };

        ws.onerror = (error) => {
          console.error("WebRTC Signaling error:", error);
          ws?.close(); // This will trigger onclose and attempt reconnection
        };

        ws.onmessage = handleSocketMessage;
      } catch (error) {
        console.error("WebRTC Signaling connection error:", error);
        reconnectTimeout = setTimeout(connect, 100);
      }
    };

    const handleSocketMessage = async (event: MessageEvent) => {
      try {
        const parsedMessage: WebRTCSignallingServerMessages = JSON.parse(event.data);
        switch (parsedMessage.type) {
          case DifferentWebRTCSignallingServerMessages.Busy:
            // TODO: Add toast notification
            alert(`User is busy with another call`);
            resetCall();
            break;

          case DifferentWebRTCSignallingServerMessages.Permission:
            setRemotePeerId(parsedMessage.payload.applicantPeerId);
            break;

          case DifferentWebRTCSignallingServerMessages.Consent:
            if (!ws) throw new Error("No socket found");
            if (callStatus !== WebRTCCallStatus.Idle) {
              ws.send(
                JSON.stringify({
                  type: DifferentWebRTCSignallingServerMessages.Busy,
                  payload: {
                    donorId: parsedMessage.payload.donorId
                  }
                })
              );
            } else {
              useVideoCallStore
                .getState()
                .handleIncomingCall(
                  parsedMessage.payload.donorId,
                  parsedMessage.payload.donorName,
                  parsedMessage.payload.donorImage
                );
              router.push(APP_PATHS.APPLICANT_DASHBOARD_VIDEO_CALL);
            }
            break;

          case DifferentWebRTCSignallingServerMessages.Error:
            // TODO: Add toast notification
            alert("Internal server error");
            break;
        }
      } catch (error) {
        console.error("Invalid message format:", error);
      }
    };

    connect();

    // Cleanup function
    return () => {
      clearTimeout(reconnectTimeout);
      ws?.removeEventListener("message", handleSocketMessage);
      ws?.close();
      peer?.destroy();
    };
  }, [status]);
};
