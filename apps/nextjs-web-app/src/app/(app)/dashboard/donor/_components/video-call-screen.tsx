"use client";

import { IoVideocamOff, IoVideocamSharp, IoVolumeMute, IoVolumeHighSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";
import { RefObject, useRef } from "react";
import { WebRTCCallStatus } from "@repo/common/types";
import { cn } from "@/lib/utils";
import React from "react";
import Draggable from "react-draggable";

type VideoCallScreenProps = {
  handleEndCall: () => void;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  localVideoRef: RefObject<HTMLVideoElement | null>;
};

export const VideoCallScreen = ({
  handleEndCall,
  remoteVideoRef,
  localVideoRef
}: VideoCallScreenProps) => {
  const dragNodeRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;

  const { remoteMediaControls, mediaControls, toggleAudio, toggleVideo, callStatus } =
    useVideoCallStore();

  return (
    <div className="bg-neutral-11 relative mx-auto h-full max-h-[60rem] max-w-[30rem]">
      {/* Remote Video (Large) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${
          !remoteMediaControls.isVideoEnabled ? "hidden" : ""
        }`}
      />
      {!remoteMediaControls.isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-blue-50">Video Paused</p>
        </div>
      )}

      {/* Local Video (Small overlay) */}
      <Draggable
        nodeRef={dragNodeRef}
        axis="both"
        handle=".handle"
        grid={[25, 25]}
        scale={1}
        bounds="parent"
        defaultPosition={{ x: 250, y: -160 }}
      >
        <div ref={dragNodeRef} className={cn("handle absolute h-40 w-40 cursor-move")}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-40 w-40 object-contain"
          />
        </div>
      </Draggable>

      {/* Controls */}
      {callStatus !== WebRTCCallStatus.Incoming && (
        <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform gap-4">
          <button
            onClick={toggleAudio}
            className={`rounded-full p-4 ${
              mediaControls.isAudioEnabled ? "bg-blue-500" : "bg-blue-500"
            }`}
          >
            {mediaControls.isAudioEnabled ? (
              <IoVolumeMute className="h-8 w-8 text-white" />
            ) : (
              <IoVolumeHighSharp className="h-8 w-8 text-white" />
            )}
          </button>

          <button onClick={handleEndCall} className="rounded-full bg-red-500 p-4">
            <MdCallEnd className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={toggleVideo}
            className={`rounded-full p-4 ${
              mediaControls.isVideoEnabled ? "bg-blue-500" : "bg-blue-500"
            }`}
          >
            {mediaControls.isVideoEnabled ? (
              <IoVideocamOff className="h-8 w-8 text-white" />
            ) : (
              <IoVideocamSharp className="h-8 w-8 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
