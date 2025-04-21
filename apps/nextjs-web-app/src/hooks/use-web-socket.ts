/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useChatStore } from "@repo/zustand/src/chat-store";
import {
  UserActivity,
  UserStatus,
  DifferentMessageStatus,
  DifferentRoomMessages,
  WebSocketsServerResponses
} from "@repo/common/types";
import { useSession } from "next-auth/react";
import { APP_PATHS } from "@/config/path.config";
import { useRouter } from "next/navigation";
import { getRoomIds } from "@/actions/message.actions";

export const useWebSocket = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    addMessage,
    addRoom,
    updateMessageRecievedStatus,
    updateMessageSeenStatus,
    updateUserOnlineStatus,
    setWs
  } = useChatStore();

  useEffect(() => {
    if (!session?.jwtToken) return;

    let ws: WebSocket | null = null;
    let reconnectAttempt = 0;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = async () => {
      try {
        console.log("Connecting to WebSocket Server");
        ws = new WebSocket(
          `${process.env.NEXT_PUBLIC_WEB_SOCKETS_BE_URL}?token=${session.jwtToken}`
        );

        // alert(`${process.env.NEXT_PUBLIC_WEB_SOCKETS_BE_URL}?token=${session.jwtToken}`);
        ws.onopen = async () => {
          // alert("CONNECTED");
          console.log("WebSocket Server Connected");
          reconnectAttempt = 0; // Reset reconnection attempts on successful connection
          setWs(ws!);
          const roomIds = await getRoomIds();
          ws?.send(
            JSON.stringify({
              type: DifferentRoomMessages.JoinRooms,
              payload: { roomIds }
            })
          );
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed. Attempting to reconnect...");
          reconnectAttempt++;
          reconnectTimeout = setTimeout(connect, 1000);
        };

        ws.onerror = (error) => {
          console.log("WebSocket error:", error);
          // ws?.close(); // This will trigger onclose and attempt reconnection
        };

        ws.onmessage = (event) => {
          const message: WebSocketsServerResponses = JSON.parse(event.data);

          switch (message.type) {
            case UserActivity.Chatting:
              const { roomId, senderId, messageId, content, sentAt } = message.payload;
              addMessage({
                messageId,
                content,
                senderId,
                roomId,
                sentAt: new Date(sentAt),
                currUserId: session?.user.id
              });
              break;

            case DifferentRoomMessages.CreateRoom:
              addRoom(message.payload);
              router.push(`${APP_PATHS.APPLICANT_DASHBOARD_MESSAGES}`); // TODO: Show  a popup window and a button in the popup window to redirect to the new room
              break;

            case DifferentMessageStatus.Received:
              updateMessageRecievedStatus(message.payload.roomId, message.payload.messageId);
              break;

            case DifferentMessageStatus.Seen:
              updateMessageSeenStatus(message.payload.roomId);
              break;

            case UserStatus.Online:
            case UserStatus.Offline:
              updateUserOnlineStatus(message.payload.userId, message.type === UserStatus.Online);
              break;
          }
        };
      } catch (error) {
        console.error("WebSocket connection error:", error);
        reconnectTimeout = setTimeout(connect, 1000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [status]);
};
