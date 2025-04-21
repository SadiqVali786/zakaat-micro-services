"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { BiCheckDouble } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { DifferentMessageStatus } from "@repo/common/types";

interface Message {
  id: string;
  content: string;
  senderId: string;
  sentAt: Date;
  status: DifferentMessageStatus;
  newDate?: string | null;
}

interface MessageContainerProps {
  messages: Message[] | undefined;
}

export function MessageContainer({ messages }: MessageContainerProps) {
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col overflow-y-auto scroll-smooth" id="messages-container">
      {messages?.map((message) => (
        <div key={message.id} className="flex flex-col">
          {message.newDate && (
            <p className="mb-2 self-center px-4 py-2 font-bold">{message.newDate}</p>
          )}
          <div className={cn(message.senderId === session?.user.id ? "self-end" : "self-start")}>
            <div
              className={cn(
                "mb-2 flex flex-col px-4 py-2 font-bold",
                message.senderId === session?.user.id
                  ? "bg-brand-blue rounded-2xl rounded-br-none"
                  : "bg-neutral-11 gap-y-1.25 rounded-2xl rounded-bl-none"
              )}
            >
              <p className="text-blue-50">{message.content}</p>
              <div
                className={cn(
                  "flex items-center gap-2 self-end text-xs font-normal",
                  message.senderId === session?.user.id ? "text-blue-100" : "text-neutral-5"
                )}
              >
                <span>{new Date(message.sentAt).toLocaleTimeString()}</span>
                {message.senderId === session?.user.id ? (
                  message.status === DifferentMessageStatus.Received ? (
                    <BiCheckDouble className="h-6 w-6 text-blue-50" />
                  ) : message.status === DifferentMessageStatus.Seen ? (
                    <BiCheckDouble className="text-brand-purple h-6 w-6" />
                  ) : (
                    <Check className="h-6 w-6 text-blue-50" />
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
