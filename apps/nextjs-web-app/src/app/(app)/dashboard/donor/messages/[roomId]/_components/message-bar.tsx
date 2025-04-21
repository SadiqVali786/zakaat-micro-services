"use client";
import { PlaceholdersAndVanishInput } from "@/components/aceternityui/placeholders-and-vanish-input";
import { useChatStore } from "@repo/zustand/src/chat-store";
import { useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

export function MessageBar() {
  const { data: session } = useSession();
  const { sendMessage } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }, 100); // Small delay to ensure DOM updates
  }, []);

  scrollToBottom();

  const handleSendMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const content = e.currentTarget.querySelector("input")?.value; // Get the value of the input
      if (!content || content.trim() === "" || !session?.user.id) return;
      sendMessage(content, session?.user.id);
    },
    [sendMessage, session?.user.id]
  );

  return (
    <>
      <PlaceholdersAndVanishInput
        placeholders={["What's on your mind? Let them know."]}
        onChange={() => {}}
        onSubmit={handleSendMessage}
      />
      <div ref={messagesEndRef} />
    </>
  );
}
