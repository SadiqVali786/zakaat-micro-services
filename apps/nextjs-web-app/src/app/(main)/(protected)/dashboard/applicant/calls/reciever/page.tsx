/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, ReactNode, JSX } from "react";
import Peer, { MediaConnection } from "peerjs";

const Receiver = () => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const remoteVideoRef = useRef<null | HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const payloadRef = useRef<any | null>(null); // TODO:

  const [mounted, setMounted] = useState(false);
  const [callReference, setCallReference] = useState<MediaConnection | null>(null);
  const [timerFlag, setTimerFlag] = useState<boolean>(false);

  const handleCloseCall = () => {
    callReference?.close();
    setCallReference(null);
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      handleCloseCall();
      if (socketRef.current) socketRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  // Connect to the signaling server and establish peer connection
  useEffect(() => {
    const socket = new WebSocket(
      "ws://192.168.1.7:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZva2M1ZDEwMDAzZDA5YjVlMG9kcDF1IiwiZnVsbG5hbWUiOiJTaGFoZWVuYSIsInJvbGUiOiJBUFBMSUNBTlQiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhci52ZXJjZWwuc2gvU2hhaGVlbmEifQ.qzUOc0TAU2ourHe7QMN54wEwKfnfdYd1cXhgqXxB45M"
    );
    socketRef.current = socket;

    socket.onopen = () => {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "CONSENT") {
          // TODO:
          if (callReference) {
            socketRef.current?.send(
              JSON.stringify({
                type: "BUSY",
                payload: { status: "BUSY", donorId: message.payload.donorId }
              })
            );
          } else {
            payloadRef.current = message.payload;
            setTimerFlag(true);
            setTimeout(() => {
              setTimerFlag(false);
            }, 5000);
          }
        }
      };

      const peer = new Peer();
      peerRef.current = peer;
      // Handle incoming call from sender
      peer.on("call", async (call) => {
        setCallReference(call);
        try {
          const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          mediaStream.current = localStream;
          call.answer(localStream); // Answer with the local stream
          if (videoRef.current) {
            videoRef.current.srcObject = localStream;
            videoRef.current.play();
          }

          call.on("stream", (remoteStream) => {
            // Assign the remote stream to the remote video element
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });

          call.on("close", handleCloseCall);

          // // Enable two-way streaming by calling the sender back
          // const senderId = call.peer;
          // peer.call(senderId, stream);
        } catch (err) {
          console.error("Failed to get local stream", err);
        }
      });
    };
  }, []);

  if (!mounted) return <div>Mounting</div>;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {timerFlag && (
        <div className="fixed z-50 flex h-screen w-screen items-center justify-center backdrop-blur-xl">
          <div className="rounded-lg border px-4 py-2">
            <p className="pb-4">Incoming call from Sadiq Vali!</p>
            <div className="flex justify-end gap-4">
              <button
                className="cursor-pointer border px-2 py-1"
                onClick={() => {
                  if (socketRef.current && peerRef.current?.id) {
                    socketRef.current.send(
                      JSON.stringify({
                        type: "PERMISSION",
                        payload: {
                          status: "PERMISSION",
                          donorId: payloadRef.current.donorId,
                          applicantPeerId: peerRef.current.id
                        }
                      })
                    );
                    setTimerFlag(false);
                  }
                }}
              >
                Accept
              </button>
              <button
                className="cursor-pointer border px-2 py-1"
                onClick={() => {
                  if (socketRef.current && peerRef.current?.id) {
                    socketRef.current.send(
                      JSON.stringify({
                        type: "BUSY",
                        payload: {
                          status: "BUSY",
                          donorId: payloadRef.current.donorId
                        }
                      })
                    );
                    setTimerFlag(false);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="fixed right-0 top-0 z-20 w-[25%]"
      />
      <video ref={remoteVideoRef} playsInline autoPlay className="object-fit h-full w-full" />
      {callReference ? (
        <Button onClick={handleCloseCall} className="fixed bottom-10">
          End Call
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

type ButtonProps = {
  onClick: () => void;
  className?: string;
  children: any;
};

function Button({ onClick, children, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-xl border border-blue-500 bg-blue-500 px-4 py-2 text-2xl ${className}`}
    >
      {children}
    </button>
  );
}

export default Receiver;
