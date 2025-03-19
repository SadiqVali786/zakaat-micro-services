import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChatMessagePayloadSchema,
  ChatMessageStatus,
  ChatMessageStatusPayloadSchema,
  ClientNewRoomSchema,
  RoomMessageTypes,
  TypesOfMsgsFromWebSktSerToClient,
  UserActivity,
  UserOfflinePayloadSchema,
  UserOnlinePayloadSchema,
  UserTypingPayloadSchema
} from "@repo/common/validators";
import { WebSktSerToClientMsgsSchema } from "@repo/common/types";
import { useWhatsAppStore } from "@repo/zustand-store/whats-app-store";

export const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<string[]>([]);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000;

  const store = useWhatsAppStore();
  const {
    addMessage,
    updateMessageStatus,
    setUserOnlineStatus,
    setUsers,
    setUserTyping,
    setLastSeen,
    addRoom
  } = store;

  const sendMessage = useCallback(
    (message: string) => {
      if (ws && isConnected) ws.send(message);
      else messageQueue.current.push(message);
    },
    [ws, isConnected]
  );

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setIsConnected(false);
    }
  }, [ws]);

  const sendJoinRoomsMessage = useCallback(() => {
    if (isConnected && ws && store.user)
      sendMessage(
        JSON.stringify({
          type: RoomMessageTypes.JoinRooms,
          payload: { roomIds: store.rooms.map((room) => room.id) }
        })
      );
  }, [isConnected, ws, sendMessage, store.user, store.rooms]);

  const sendLeaveRoomsMessage = useCallback(() => {
    if (isConnected && ws && store.user)
      sendMessage(
        JSON.stringify({
          type: RoomMessageTypes.LeaveRooms,
          payload: { roomIds: store.rooms.map((room) => room.id) }
        })
      );
  }, [isConnected, ws, sendMessage, store.user, store.rooms]);

  const sendChatMessage = useCallback(
    (message: string, roomId: number) => {
      if (isConnected && ws && store.user)
        sendMessage(JSON.stringify({ type: UserActivity.Chating, payload: { roomId, message } }));
    },
    [isConnected, ws, sendMessage, store.user]
  );

  const sendTypingMessage = useCallback(
    (roomId: number) => {
      if (isConnected && ws && store.user)
        sendMessage(JSON.stringify({ type: UserActivity.Typing, payload: { roomId } }));
    },
    [isConnected, ws, sendMessage, store.user]
  );

  const sendSeenMessage = useCallback(
    (roomId: number, senderId: string, messageId: number, status: ChatMessageStatus) => {
      if (isConnected && ws && store.user)
        sendMessage(
          JSON.stringify({
            type: ChatMessageStatus.MessageSeen,
            payload: { roomId, senderId, messageId, status, time: new Date() }
          })
        );
    },
    [isConnected, ws, sendMessage, store.user]
  );

  const sendCreateRoomMessage = useCallback(
    (name: string, participients: string[]) => {
      if (isConnected && ws && store.user)
        sendMessage(
          JSON.stringify({ type: RoomMessageTypes.CreateRoom, payload: { name, participients } })
        );
    },
    [isConnected, ws, sendMessage, store.user]
  );

  useEffect(() => {
    const connect = () => {
      const newWs = new WebSocket(url);
      setWs(newWs);

      newWs.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;
        messageQueue.current.forEach((message) => newWs.send(message));
        messageQueue.current = [];
      };

      newWs.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          setTimeout(() => {
            console.log(`Attempting to reconnect... (attempt ${reconnectAttempts.current + 1})`);
            reconnectAttempts.current++;
            connect();
          }, RECONNECT_INTERVAL);
        } else {
          console.log("Max reconnect attempts reached. Stopping reconnection.");
        }
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
    };

    connect();

    return () => {
      if (ws) {
        sendLeaveRoomsMessage();
        ws.close();
      }
    };
  }, [url, ws, sendLeaveRoomsMessage]);

  useEffect(() => {
    if (ws && isConnected) {
      ws.onmessage = (event) => {
        const message: WebSktSerToClientMsgsSchema = JSON.parse(event.data);

        if (message.type === TypesOfMsgsFromWebSktSerToClient.Chating) {
          const payload = ChatMessagePayloadSchema.parse(message.payload);
          if (!payload.sentAt || !payload.messageId) {
            return; // TODO: toast msg alert
          }
          addMessage(payload.roomId, {
            senderId: payload.senderId,
            messageId: payload.messageId,
            sentAt: payload.sentAt,
            message: payload.message,
            status: ChatMessageStatus.MessageRecieved
          });
          sendMessage(
            JSON.stringify({
              type: ChatMessageStatus.MessageRecieved,
              payload: {
                messageId: payload.messageId,
                roomId: payload.roomId,
                senderId: payload.senderId,
                status: ChatMessageStatus.MessageRecieved,
                time: new Date()
              }
            })
          );
        } else if (
          message.type === TypesOfMsgsFromWebSktSerToClient.MessageRecieved ||
          message.type === TypesOfMsgsFromWebSktSerToClient.MessageSeen
        ) {
          const payload = ChatMessageStatusPayloadSchema.parse(message.payload);
          if (!payload.time) {
            return; // TODO: toast msg alert
          }
          // TODO: remove senderId from the payload
          updateMessageStatus(
            payload.roomId,
            payload.messageId,
            payload.status as unknown as ChatMessageStatus,
            new Date(payload.time)
          );
        } else if (message.type === TypesOfMsgsFromWebSktSerToClient.Online) {
          // TODO: remove roomId from the payload
          const payload = UserOnlinePayloadSchema.parse(message.payload);
          setUserOnlineStatus(payload.userId, true);
        } else if (message.type === TypesOfMsgsFromWebSktSerToClient.Offline) {
          // TODO: remove roomId from the payload
          const payload = UserOfflinePayloadSchema.parse(message.payload);
          setUserOnlineStatus(payload.userId, false);
        } else if (message.type === TypesOfMsgsFromWebSktSerToClient.Typing) {
          const payload = UserTypingPayloadSchema.parse(message.payload);
          setUserTyping(payload.roomId, payload.userId, true);
          setTimeout(() => setUserTyping(payload.roomId, payload.userId, false), 3000);
        } else if (message.type === TypesOfMsgsFromWebSktSerToClient.CreateRoom) {
          const payload = ClientNewRoomSchema.parse(message.payload);
          addRoom(payload);
        }
      };
    }
  }, [
    ws,
    isConnected,
    addMessage,
    updateMessageStatus,
    setUserOnlineStatus,
    setUserTyping,
    setUsers,
    store,
    setLastSeen,
    sendMessage,
    addRoom
  ]);

  return {
    ws,
    isConnected,
    sendMessage,
    disconnect,
    sendChatMessage,
    sendTypingMessage,
    sendSeenMessage,
    sendCreateRoomMessage,
    sendLeaveRoomsMessage,
    sendJoinRoomsMessage
  };
};
