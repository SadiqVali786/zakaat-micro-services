"use client";

import { APP_PATHS } from "@/config/path.config";
import { cn, formatRelativeDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Video } from "lucide-react";
import { useChatStore } from "@repo/zustand/src/chat-store";

export const Feedbar = () => {
  const pathname = usePathname();
  const store = useChatStore();

  if (pathname.includes("tweets"))
    return (
      <div className="border-neutral-11 xs:pt-8 sticky top-0 z-50 flex h-20 border-b-[1px] pt-4 backdrop-blur-3xl">
        <Link
          href={APP_PATHS.DONOR_DASHBOARD_TWEETS}
          className={cn(
            "w-[50%] grow py-[10px] text-center leading-tight text-blue-50",
            pathname.includes(APP_PATHS.DONOR_DASHBOARD_TWEETS)
              ? "border-brand-blue border-b-[1px]"
              : ""
          )}
        >
          Tweets
        </Link>
        <Link
          href={APP_PATHS.DONOR_DASHBOARD_FOLLOWING_TWEETS}
          className={cn(
            "w-[50%] grow py-[10px] text-center leading-tight text-blue-50",
            pathname.includes(APP_PATHS.DONOR_DASHBOARD_FOLLOWING_TWEETS)
              ? "border-brand-blue border-b-[1px]"
              : ""
          )}
        >
          Following Tweets
        </Link>
      </div>
    );

  if (pathname.includes("messages") && pathname.split("/").pop() !== "messages") {
    const room = store.rooms.find((room) => room.roomId === store.currentRoomId);

    // last message's sentAt that not sent by room?.participant.id
    const lastSeen = room?.messages.find(
      (message) => message.senderId !== room?.participant.id
    )?.sentAt;

    return (
      <div className="border-neutral-11 xs:pt-8 sticky top-0 flex h-20 !w-full items-center gap-x-2 border-b-[1px] px-4 pt-4 pb-4 backdrop-blur-3xl">
        <div className="flex w-full items-center justify-between gap-x-2">
          {/* TODO: make this div block a server component given roomId */}
          <div className="flex items-center gap-x-1">
            <Avatar className="h-11 w-11">
              <AvatarImage src={room?.image} />
              <AvatarFallback>{room?.roomName}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-lg font-medium">{room?.roomName}</p>
              <p className="text-sm">
                last seen {formatRelativeDate(new Date(lastSeen || Date.now()))}
              </p>
            </div>
          </div>
          <Video className="text-brand-purple fill-brand-purple h-8 w-8 cursor-pointer" />
        </div>
      </div>
    );
  }

  if (pathname.includes("video-call")) return null;

  return (
    <div className="border-neutral-11 xs:pt-8 sticky top-0 flex h-20 !w-full items-center gap-x-2 border-b-[1px] pt-4 pb-4 pl-4 backdrop-blur-3xl">
      <ArrowLeft className="h-8 w-8 cursor-pointer" />
      <span>{pathname.split("/").pop()}</span>
    </div>
  );
};
