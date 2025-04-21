"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";

export const RenderOutgoingCallStatus = () => {
  const { callerInfo } = useVideoCallStore();

  return (
    <div className="bg-opacity-50 absolute inset-0 z-50 flex flex-col items-center justify-center gap-y-8">
      <Avatar className="h-40 w-40">
        <AvatarImage src={callerInfo?.image} className="bg-neutral-7 rounded-full object-contain" />
        <AvatarFallback>{callerInfo?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <p>Ringing...</p>
    </div>
  );
};
