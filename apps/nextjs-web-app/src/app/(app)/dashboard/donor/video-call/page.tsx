/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";
import { APP_PATHS } from "@/config/path.config";
import { useMediaStream } from "@/hooks/use-media-stream";
import { UserRole, WebRTCCallStatus } from "@repo/common/types";
// import { MdCall, MdCallEnd } from "react-icons/md";
// import { IoVideocamOff, IoVideocamSharp, IoVolumeMute } from "react-icons/io5";
// import { IoVolumeHighSharp } from "react-icons/io5";
import { RenderOutgoingCallStatus } from "@/app/(app)/dashboard/_components/render-outgoing-call-status";
import { VideoCallScreen } from "@/app/(app)/dashboard/donor/_components/video-call-screen";
import { useSession } from "next-auth/react";

export default function VideoCallPage() {
  const router = useRouter();

  const { data: session } = useSession();
  if (session?.user.role !== UserRole.Donor) {
    if (session?.user.role === UserRole.Applicant) {
      router.push(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
    } else if (session?.user.role === UserRole.Verifier) {
      router.push(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
    } else {
      router.push(APP_PATHS.HOME);
    }
  }

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  useMediaStream(localVideoRef);

  const [timeLeft, setTimeLeft] = useState(30);

  const {
    peer,
    callStatus,
    setCallReference,
    setMediaStream,
    resetCall,
    setCallStatus,
    remotePeerId,
    mediaStream
  } = useVideoCallStore();

  // Add timer effect for incoming calls
  useEffect(() => {
    if (callStatus === WebRTCCallStatus.Incoming) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callStatus]);

  // Reset timer when call status changes
  useEffect(() => {
    setTimeLeft(30);
  }, [callStatus]);

  useEffect(() => {
    // If user directly accesses this page without an active call, redirect them
    if (callStatus === WebRTCCallStatus.Idle) {
      router.replace(APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS);
      return;
    }

    // Get user media
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setMediaStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Failed to get media stream:", error);
      }
    };

    initializeMedia();
  }, []);

  // For incoming calls
  useEffect(() => {
    if (peer && mediaStream) {
      peer.on("call", (call) => {
        setCallReference(call);
        setCallStatus(WebRTCCallStatus.Incoming);
        call.answer(mediaStream);

        // Set up data channel for incoming calls
        const dataChannel = call.peerConnection.createDataChannel("mediaControls");
        setupDataChannel(dataChannel);

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            setCallStatus(WebRTCCallStatus.Connected);
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(console.error);
          }
        });

        // Handle incoming data channel
        call.peerConnection.ondatachannel = (event) => {
          setupDataChannel(event.channel);
        };

        call.on("close", handleEndCall);
        call.on("error", handleEndCall);
      });
    }
  }, [mediaStream]);

  // For outgoing calls
  useEffect(() => {
    if (peer && remotePeerId && mediaStream) {
      const call = peer.call(remotePeerId, mediaStream);
      setCallReference(call);
      setCallStatus(WebRTCCallStatus.Outgoing);

      // Set up data channel for outgoing calls
      const dataChannel = call.peerConnection.createDataChannel("mediaControls");
      setupDataChannel(dataChannel);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          setCallStatus(WebRTCCallStatus.Connected);
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(console.error);
        }
      });

      // Handle incoming data channel
      call.peerConnection.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };

      call.on("close", handleEndCall);
      call.on("error", handleEndCall);
    }
  }, [remotePeerId]);

  const setupDataChannel = (channel: RTCDataChannel) => {
    const { setDataChannel, setRemoteMediaControls } = useVideoCallStore.getState();

    channel.onopen = () => {
      console.log("Data channel is open");
      setDataChannel(channel);
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "mediaControl") {
          // Only update the control that was actually changed
          setRemoteMediaControls({
            isAudioEnabled: data.audio !== undefined ? data.audio : undefined,
            isVideoEnabled: data.video !== undefined ? data.video : undefined
          });
        }
      } catch (error) {
        console.error("Error parsing data channel message:", error);
      }
    };

    channel.onclose = () => {
      console.log("Data channel is closed");
      setDataChannel(null);
    };
  };

  const handleEndCall = () => {
    resetCall();
    router.replace(APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {callStatus === WebRTCCallStatus.Outgoing && <RenderOutgoingCallStatus />}
      <VideoCallScreen
        handleEndCall={handleEndCall}
        remoteVideoRef={remoteVideoRef}
        localVideoRef={localVideoRef}
      />
    </div>
  );
}
