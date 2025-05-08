/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef } from "react";
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
import { toast } from "sonner";

const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 1000; // 1s

export const useWebRTCSignaling = () => {
  const { data: session, status } = useSession();
  const { setPeer, setSocket, callStatus, setRemotePeerId, resetCall } = useVideoCallStore();
  const router = useRouter();

  let ws: WebSocket | null = null;
  let reconnectAttempt = 0;
  let reconnectTimeout: NodeJS.Timeout;
  let peer: Peer | null = null;

  useEffect(() => {
    if (!session?.jwtToken) return;

    const connect = () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_WEB_RTC_SIGNALLING_SERVER_BE_URL}?token=${session.jwtToken}`;
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
          reconnectAttempt++;
          if (reconnectAttempt <= MAX_RECONNECT_ATTEMPTS) {
            peer?.destroy();
            reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
          } else {
            console.warn("Max reconnection attempts reached.");
          }
        };

        ws.onerror = (error) => {
          console.error("WebRTC Signaling error:", error);
          ws?.close(); // This will trigger onclose and attempt reconnection
        };

        ws.onmessage = async (event: MessageEvent) => {
          try {
            const parsedMessage: WebRTCSignallingServerMessages = JSON.parse(event.data);
            switch (parsedMessage.type) {
              case DifferentWebRTCSignallingServerMessages.Busy:
                toast.info("User is busy with another call");
                resetCall();
                break;

              case DifferentWebRTCSignallingServerMessages.Permission:
                setRemotePeerId(parsedMessage.payload.applicantPeerId);
                break;

              case DifferentWebRTCSignallingServerMessages.Consent:
                if (!ws) throw new Error("No socket found");
                if (callStatus !== WebRTCCallStatus.Idle) {
                  ws?.send(
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
                toast.error("Internal server error");
                break;
            }
          } catch (error) {
            console.error("Invalid message format:", error);
            toast.error("Invalid message format");
          }
        };
      } catch (error) {
        console.error("WebRTC Signaling connection error:", error);
        reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
      }
    };

    connect();

    // Cleanup function
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
      peer!.destroy();
    };
  }, [status]);
};
