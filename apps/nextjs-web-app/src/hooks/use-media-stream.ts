/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, RefObject, useRef } from "react";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";

export const useMediaStream = (videoRef: RefObject<HTMLVideoElement | null>) => {
  const { setMediaStream } = useVideoCallStore();
  const initAttempted = useRef(false);

  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Failed to get media stream:", error);
      }
    };

    initializeMedia();

    return () => {
      useVideoCallStore
        .getState()
        .mediaStream?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);
};
