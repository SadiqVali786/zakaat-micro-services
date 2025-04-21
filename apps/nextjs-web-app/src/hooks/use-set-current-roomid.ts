"use client";

import { useChatStore } from "@repo/zustand/src/chat-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const useSetCurrentRoomId = () => {
  const { setCurrentRoomId } = useChatStore();
  const params = useParams();
  const roomId = params.roomId as string;

  useEffect(() => {
    setCurrentRoomId(roomId);
  }, [roomId, setCurrentRoomId]);
};
