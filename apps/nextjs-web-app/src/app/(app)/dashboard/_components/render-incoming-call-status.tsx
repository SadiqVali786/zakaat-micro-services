"use client";

import { MdCall } from "react-icons/md";

import { APP_PATHS } from "@/config/path.config";
import { useVideoCallStore } from "@repo/zustand/src/video-call-store";
import { MdCallEnd } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export const RenderIncomingCallStatus = ({ timeLeft }: { timeLeft: number }) => {
  const router = useRouter();
  const { callerInfo } = useVideoCallStore();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-y-8">
      <Avatar className="h-40 w-40">
        <AvatarImage src={callerInfo?.image} className="bg-neutral-7 rounded-full object-contain" />
        <AvatarFallback>{callerInfo?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <p>Incoming call...</p>
        <p className="text-neutral-7 text-sm">Call will be rejected in {timeLeft} seconds</p>
      </div>
      <div className="flex w-full justify-center gap-10">
        <button
          onClick={() => useVideoCallStore.getState().acceptCall()}
          className="rounded-full bg-green-500 p-4 text-white"
        >
          <MdCall className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={() => {
            useVideoCallStore.getState().rejectCall();
            router.replace(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
          }}
          className="rounded-full bg-red-500 p-4 text-white"
        >
          <MdCallEnd className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
};
