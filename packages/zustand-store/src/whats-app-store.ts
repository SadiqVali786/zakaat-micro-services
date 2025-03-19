import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { UserRole } from "@repo/mongodb";
import { ChatMessageStatus } from "@repo/common/validators";

type UserType = {
  id: string;
  role: UserRole;
  lastSeen: Date;
  fullname: string;
  avatar: string;
  online: boolean;
};

type MessageType = {
  messageId: number;
  senderId: string;
  message: string;
  sentAt: Date;
  recievedAt?: Date;
  seenAt?: Date;
  status: ChatMessageStatus;
};

type RoomType = {
  id: number;
  name: string;
  participients: {
    userId: string;
    typing: boolean;
  }[];
  messages: MessageType[] | [];
};

type WhatsAppState = {
  user: UserType | null; // TODO: You can delete this
  users: Record<string, UserType>;
  rooms: RoomType[] | [];
  setUser: (user: UserType) => void; // TODO: You can delete this
  setUsers: (users: Record<string, UserType>) => void; // TODO: handle this with REST API
  addRoom: (room: RoomType) => void;
  addMessage: (roomId: number, message: MessageType) => void;
  updateMessageStatus: (
    roomId: number,
    messageId: number,
    status: ChatMessageStatus,
    time: Date
  ) => void;
  setUserOnlineStatus: (userId: string, online: boolean) => void;
  setUserTyping: (roomId: number, userId: string, typing: boolean) => void;
  setLastSeen: (userId: string, lastSeen: Date) => void; // TODO: update backend for this
};

export const useWhatsAppStore = create<WhatsAppState>()(
  immer(
    persist(
      (set) => ({
        user: null,
        users: {},
        rooms: [],
        setUser: (user) =>
          set((state) => {
            state.user = user;
          }),
        setUsers: (usersInput) =>
          set((state) => {
            for (const userId in usersInput)
              state.users[userId] = { ...state.users[userId], ...usersInput[userId] } as UserType;
          }),
        addRoom: (room) =>
          set((state) => {
            if (!state.rooms.some((r) => r.id === room.id)) state.rooms = [...state.rooms, room];
          }),
        addMessage: (roomId, message) =>
          set((state) => {
            const room = state.rooms.find((r) => r.id === roomId);
            if (room) room.messages = [...room.messages, message];
          }),
        updateMessageStatus: (roomId, messageId, status, time) =>
          set((state) => {
            const room = state.rooms.find((r) => r.id === roomId);
            if (room) {
              const message = room.messages.find((m) => m.messageId === messageId);
              if (message) Object.assign(message, { status, time });
            }
          }),
        setUserOnlineStatus: (userId, online) =>
          set((state) => {
            if (state.users[userId]) state.users[userId].online = online;
          }),
        setLastSeen: (userId, lastSeen) =>
          set((state) => {
            if (state.users[userId]) state.users[userId].lastSeen = lastSeen;
          }),
        setUserTyping: (roomId, userId, typing) =>
          set((state) => {
            const room = state.rooms.find((r) => r.id === roomId);
            if (room) {
              const user = room.participients.find((p) => p.userId === userId);
              if (user) user.typing = typing;
            }
          })
      }),
      { name: "whatsapp-storage" }
    )
  )
);
