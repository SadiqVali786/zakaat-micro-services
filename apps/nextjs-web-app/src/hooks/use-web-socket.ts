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

const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 1000; // 1s

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
        const url = `${process.env.NEXT_PUBLIC_WEB_SOCKETS_BE_URL}?token=${session.jwtToken}`;
        console.log("Connecting to WebSocket Server", url);
        ws = new WebSocket(url);

        ws.onopen = async () => {
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

          if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempt++;
            console.log(
              `Reconnecting in ${RECONNECT_DELAY}ms (attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})`
            );
            reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
          } else {
            console.log("Max reconnection attempts reached");
          }
        };

        ws.onerror = (error) => {
          console.log("WebSocket error:", error);
          ws?.close();
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
              router.push(`${APP_PATHS.APPLICANT_DASHBOARD_MESSAGES}`);
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
        if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
        }
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [status]);
};
