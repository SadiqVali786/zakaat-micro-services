import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { DifferentMessageStatus, UserActivity } from "@repo/common/types";

type Message = {
  id: string;
  content: string;
  senderId: string;
  status: DifferentMessageStatus;
  sentAt: Date;
};

type Room = {
  roomId: string;
  roomName: string;
  image: string;
  unreadMessages: number;
  messages: Message[];
  participant: {
    id: string;
    isOnline: boolean;
  };
};

interface ChatStore {
  rooms: Room[];
  ws: WebSocket | null;
  currentRoomId: string | null; // to track which room is currently open

  // Actions
  sendMessageSeenStatus: () => void;
  sendMessage: (content: string, userId: string) => void;
  setCurrentRoomId: (roomId: string | null) => void;
  setWs: (ws: WebSocket) => void;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: {
    roomId: string;
    senderId: string;
    content: string;
    messageId: string;
    sentAt: Date;
    currUserId: string;
  }) => void;
  updateMessageSeenStatus: (roomId: string) => void;
  updateMessageRecievedStatus: (roomId: string, messageId: string) => void;
  updateUserOnlineStatus: (userId: string, isOnline: boolean) => void;
  resetUnreadMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    immer((set) => ({
      rooms: [],
      ws: null,
      currentRoomId: null,

      addMessage: (message) =>
        set((state) => {
          const room = state.rooms.find((r) => r.roomId === message.roomId);
          if (room) {
            room.messages.push({
              id: message.messageId,
              content: message.content,
              senderId: message.senderId,
              status:
                message.roomId === state.currentRoomId &&
                message.currUserId !== message.senderId
                  ? DifferentMessageStatus.Seen
                  : DifferentMessageStatus.Received,
              sentAt: message.sentAt,
            });
            if (
              message.roomId === state.currentRoomId &&
              message.currUserId !== message.senderId
            ) {
              state.ws?.send(
                JSON.stringify({
                  type: DifferentMessageStatus.Seen,
                  payload: {
                    roomId: message.roomId,
                    senderId: message.senderId,
                  },
                })
              );
              state.resetUnreadMessages();
            } else {
              state.ws?.send(
                JSON.stringify({
                  type: DifferentMessageStatus.Received,
                  payload: {
                    roomId: message.roomId,
                    senderId: message.senderId,
                    messageId: message.messageId,
                  },
                })
              );
              room.unreadMessages++;
            }
          }
        }),

      sendMessageSeenStatus: () =>
        set((state) => {
          state.updateMessageSeenStatus(DifferentMessageStatus.Seen);
          state.ws?.send(
            JSON.stringify({
              type: DifferentMessageStatus.Seen,
              payload: {
                roomId: state.currentRoomId,
                senderId: state.rooms.find(
                  (room) => room.roomId === state.currentRoomId
                )?.participant.id,
              },
            })
          );
        }),

      sendMessage: (content, userId) => {
        if (content.trim() === "") return;
        set((state) => {
          state.ws?.send(
            JSON.stringify({
              type: UserActivity.Chatting,
              payload: {
                roomId: state.currentRoomId,
                senderId: userId,
                content,
              },
            })
          );
        });
      },

      setCurrentRoomId: (roomId) =>
        set((state) => {
          state.currentRoomId = roomId;
          console.log("currentRoomId set to", state.currentRoomId);
        }),

      resetUnreadMessages: () =>
        set((state) => {
          const room = state.rooms.find(
            (r) => r.roomId === state.currentRoomId
          );
          if (room) {
            room.unreadMessages = 0;
          }
        }),

      addRoom: (room) =>
        set((state) => {
          state.rooms.push(room);
        }),

      setWs: (ws) => set({ ws }),

      setRooms: (rooms) => set({ rooms }),

      setMessages: (messages) =>
        set((state) => {
          const room = state.rooms.find(
            (r) => r.roomId === state.currentRoomId
          );
          if (room) {
            room.messages = messages;
          }
        }),

      // addMessage: (message) => set((state) => {}),

      updateMessageRecievedStatus: (roomId, messageId) =>
        set((state) => {
          const room = state.rooms.find((r) => r.roomId === roomId);
          if (room) {
            const message = room.messages.find((m) => m.id === messageId);
            if (message) {
              message.status = DifferentMessageStatus.Received;
            }
          }
        }),

      updateMessageSeenStatus: (roomId) =>
        set((state) => {
          const room = state.rooms.find((r) => r.roomId === roomId);
          if (room) {
            room.messages.forEach((message) => {
              message.status = DifferentMessageStatus.Seen;
            });
          }
        }),

      updateUserOnlineStatus: (userId, isOnline) =>
        set((state) => {
          state.rooms.forEach((room) => {
            if (room.participant.id === userId) {
              room.participant.isOnline = isOnline;
            }
          });
        }),
    })),
    { name: "chat-storage" }
  )
);
