"use client";

import { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

const Sender = () => {
  const [mounted, setMounted] = useState(false);
  const [callReference, setCallReference] = useState<MediaConnection | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [ringingState, setRingingState] = useState<boolean>(false);

  const videoRef = useRef<null | HTMLVideoElement>(null);
  const remoteVideoRef = useRef<null | HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [peerId, setPeerId] = useState<string | null>(null);

  const handleCloseCall = () => {
    callReference?.close();
    setCallReference(null);
    setRemotePeerId(null);
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

  // Connect to the signaling server, establish peer connection, and listen for receiver ID
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;
    peer.on("open", (id) => {
      setPeerId(id);
    });

    const socket = new WebSocket(
      "ws://192.168.1.7:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZvazdsZTgwMDAwZDA5YmV6aDJrNm9tIiwiZnVsbG5hbWUiOiJTYWRpcSBWYWxpIiwicm9sZSI6IkRPTk9SIiwiYXZhdGFyIjoiaHR0cHM6Ly9hdmF0YXIudmVyY2VsLnNoL1NhZGlxJTIwVmFsaSJ9.BWNfCAckWQjIHmaSQ3_cIWEPJ__x5KANq4qWgVo3_qc"
    );
    socketRef.current = socket;
    socket.onopen = () => {
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "BUSY") {
          alert(`${message.payload.name} is talking with someone else`);
        } else if (message.type === "PERMISSION") {
          setRemotePeerId(message.payload.applicantPeerId);
        }
      };
    };
  }, []);

  const initiateCall = async () => {
    if (!peerRef.current || !remotePeerId) return;
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStream.current = localStream;

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
        videoRef.current.play();
      }

      const call = peerRef.current.call(remotePeerId, localStream);
      setCallReference(call);

      // Handle incoming stream from the receiver's call back
      call.on("stream", (remoteStream) => {
        setRingingState(false); // Hide "Ringing..." UI
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });

      call.on("close", () => {
        setRingingState(false); // Hide "Ringing..." UI
        handleCloseCall();
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  useEffect(() => {
    if (remotePeerId) {
      setRingingState(false);
      (async () => {
        await initiateCall();
      })();
    }
  }, [remotePeerId]);

  if (!mounted) return <div>Mounting</div>;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="fixed right-0 top-0 z-20 w-[25%]"
      />
      <video ref={remoteVideoRef} playsInline autoPlay className="object-fit h-full w-full" />
      <div className="fixed bottom-10">
        {ringingState ? (
          <Button onClick={() => {}}>Ringing...</Button>
        ) : callReference ? (
          <Button onClick={handleCloseCall}>End Call</Button>
        ) : peerId ? (
          <div className="flex flex-col gap-10">
            <Button
              onClick={() => {
                if (socketRef.current) {
                  setRingingState(true);
                  setTimeout(() => {
                    setRingingState(false);
                  }, 5000);
                  socketRef.current.send(
                    JSON.stringify({
                      type: "CONSENT",
                      payload: { applicantId: "cm6okc5d10003d09b5e0odp1u" }
                    })
                  );
                }
              }}
            >
              Call Brother
            </Button>
            <Button
              onClick={() => {
                if (socketRef.current) {
                  setRingingState(true);
                  setTimeout(() => {
                    setRingingState(false);
                  }, 5000);
                  socketRef.current.send(
                    JSON.stringify({
                      type: "CONSENT",
                      payload: { applicantId: "cm6okc5d10003d09b5e0odp1u" }
                    })
                  );
                }
              }}
            >
              Call Sister
            </Button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
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

export default Sender;

// {"use client";

// import { useEffect, useRef, useState } from "react";
// import Peer, { MediaConnection } from "peerjs";
// import { Button } from "@repo/ui";

// const Sender = () => {
//   const [mounted, setMounted] = useState(false);
//   const videoRef = useRef<null | HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<null | HTMLVideoElement>(null);
//   const peerRef = useRef<Peer | null>(null);
//   const mediaStream = useRef<MediaStream | null>(null);
//   const [callReference, setCallReference] = useState<MediaConnection | null>(null);
//   const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
//   const [ringingState, setRingingState] = useState<boolean>(false);
//   const socketRef = useRef<WebSocket | null>(null);

//   // Handle component mount and unmount
//   useEffect(() => {
//     setMounted(true);
//     return () => {
//       setMounted(false);
//       if (callReference) {
//         callReference.close();
//         setCallReference(null);
//       }
//       if (peerRef.current) peerRef.current.destroy();
//       mediaStream.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   // Connect to the signaling server, establish peer connection, and listen for receiver ID
//   useEffect(() => {
//     const socket = new WebSocket(
//       "ws://192.168.1.7:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZvazdsZTgwMDAwZDA5YmV6aDJrNm9tIiwiZnVsbG5hbWUiOiJTYWRpcSBWYWxpIiwicm9sZSI6IkRPTk9SIn0.FyLPKjkY68sheOEWBvrHZ38Q7ROUTNG5naX2mwGGhuQ"
//     );
//     socketRef.current = socket;
//     socket.onopen = () => {
//       socket.send(JSON.stringify({ type: "sender" }));

//       const peer = new Peer();
//       peerRef.current = peer;

//       peer.on("open", (id) => {
//         socket.send(JSON.stringify({ type: "senderId", id }));
//       });

//       socket.onmessage = async (event) => {
//         const message = JSON.parse(event.data);
//         if (message.type === "receiverId") {
//           setRemotePeerId(message.id);
//         }
//       };
//     };
//   }, []);

//   useEffect(() => {
//     if (remotePeerId) {
//       (async () => {
//         await initiateCall();
//       })();
//     }
//   }, [remotePeerId]);

//   const handleCloseCall = () => {
//     callReference?.close();
//     setCallReference(null);
//     mediaStream.current?.getTracks().forEach((track) => track.stop());
//     if (videoRef.current) videoRef.current.srcObject = null;
//     setRemotePeerId(null);
//   };

//   // Initiate a call to the receiver
//   const initiateCall = async () => {
//     // if (!socketRef.current || !peerRef.current || !remotePeerId) return;
//     console.log("reached", !socketRef.current, !peerRef.current, !remotePeerId);
//     try {
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });
//       mediaStream.current = localStream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = localStream;
//         videoRef.current.play();
//       }
//       const call = peerRef.current!.call(remotePeerId!, localStream);
//       setCallReference(call);
//       setRingingState(true); // Assuming you have a state variable for this
//       // Set a timeout for user response
//       const timeout = setTimeout(() => {
//         // Check if the call is still active
//         handleCloseCall(); // Reject the call if no response within timeout
//         setRingingState(false);
//       }, 5000); // Timeout in milliseconds (e.g., 5 seconds)
//       // Show "Ringing..." UI
//       call.on("stream", (remoteStream) => {
//         // Handle incoming stream from the receiver's call back
//         clearTimeout(timeout); // Clear timeout if user answers
//         setRingingState(false); // Hide "Ringing..." UI
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = remoteStream;
//           remoteVideoRef.current.play();
//         }
//       });

//       call.on("close", () => {
//         // ... (Rest of your close handling code) ...
//         clearTimeout(timeout); // Clear timeout in any case
//         setRingingState(false); // Hide "Ringing..." UI
//         handleCloseCall();
//       });
//     } catch (err) {
//       console.error("Failed to get local stream", err);
//     }
//   };

//   // Display loading message while mounting
//   if (!mounted) return <div>Mounting</div>;

//   return (
//     <div className="flex h-screen w-screen flex-col items-center justify-center">
//       <video
//         ref={videoRef}
//         playsInline
//         autoPlay
//         muted
//         className="fixed right-0 top-0 z-20 w-[25%]"
//       />
//       <video ref={remoteVideoRef} playsInline autoPlay className="object-fit h-full w-full" />
//       {ringingState ? (
//         <Button onClick={() => {}}>Ringing...</Button>
//       ) : callReference ? (
//         <Button onClick={handleCloseCall}>End Call</Button>
//       ) : (
//         <Button
//           onClick={() => {
//             if (socketRef.current) {
//               socketRef.current.send(JSON.stringify({ type: "consent" }));
//             }
//           }}
//         >
//           Call Brother
//         </Button>
//       )}
//     </div>
//   );
// };

// export default Sender;
// }
