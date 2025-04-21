"use client";

import { useWebSocket } from "@/hooks/use-web-socket";
import { useSetCurrentRoomId } from "@/hooks/use-set-current-roomid";

export function InitWebSocketsConnection() {
  useSetCurrentRoomId();
  useWebSocket();

  return null;
}
