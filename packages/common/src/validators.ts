import { z } from "zod";

export enum UserStatus {
  Online = "ONLINE",
  Offline = "OFFLINE"
}

export enum UserActivity {
  Typing = "TYPING",
  Chating = "CHATING",
  Email = "EMAIL"
}

export enum RoomMessageTypes {
  JoinRooms = "JOIN_ROOMS",
  LeaveRooms = "LEAVE_ROOMS",
  CreateRoom = "CREATE_ROOM"
}

export enum ChatMessageStatus {
  MessageSent = "MESSAGE_SENT",
  MessageRecieved = "MESSAGE_RECIEVED",
  MessageSeen = "MESSAGE_SEEN"
}

export enum TypesOfMsgsFromClientToWebSktSer {
  JoinRooms = RoomMessageTypes.JoinRooms,
  LeaveRooms = RoomMessageTypes.LeaveRooms,
  CreateRoom = RoomMessageTypes.CreateRoom,
  Chating = UserActivity.Chating,
  Typing = UserActivity.Typing,
  Offline = UserStatus.Offline,
  Online = UserStatus.Online,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen
}

export enum TypesOfMsgsFromWebSktSerToClient {
  Chating = UserActivity.Chating,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen,
  Typing = UserActivity.Typing,
  Online = UserStatus.Online,
  Offline = UserStatus.Offline,
  CreateRoom = RoomMessageTypes.CreateRoom
}

export enum TypesOfMsgsFromWebSktSerToPubSub {
  Typing = UserActivity.Typing,
  Online = UserStatus.Online,
  Offline = UserStatus.Offline
}

export enum TypesOfMsgsFromWebSktSerToMsgQueue {
  Chating = UserActivity.Chating,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen
}

export enum TypesOfMsgsFromClientToMsgQueue {
  Email = UserActivity.Email
}

export enum TypesOfMsgsFromMsgQueueToWorker {
  Chating = UserActivity.Chating,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen,
  Email = UserActivity.Email,
  Offline = UserStatus.Offline
}

export enum TypesOfMsgsFromWorkerToPubSub {
  Chating = UserActivity.Chating,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen
}

export enum TypesOfMsgsFromPubSubToWebSktSer {
  Chating = UserActivity.Chating,
  CreateRoom = RoomMessageTypes.CreateRoom,
  MessageRecieved = ChatMessageStatus.MessageRecieved,
  MessageSeen = ChatMessageStatus.MessageSeen,
  Typing = UserActivity.Typing,
  Online = UserStatus.Online,
  Offline = UserStatus.Offline
}

export const JoinRoomsMessagePayloadSchema = z.object({ roomIds: z.array(z.number()) });

export const LeaveRoomsMessagePayloadSchema = z.object({ roomIds: z.array(z.number()) });

export const NewRoomMessagePayloadSchema = z.object({
  applicantId: z.string(),
  donorId: z.string(),
  roomId: z.number()
});

export const ClientNewRoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  participients: z.array(z.object({ userId: z.string(), typing: z.boolean() })),
  messages: z.array(z.any())
});

export const ChatMessagePayloadSchema = z.object({
  roomId: z.number(),
  senderId: z.string(),
  message: z.string(),
  messageId: z.number().optional(),
  sentAt: z
    .string()
    .transform((str) => new Date(str))
    .optional()
});

export const UserTypingPayloadSchema = z.object({
  roomId: z.number(),
  userId: z.string()
});

export const UserOnlinePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.string()
});

export const UserOfflinePayloadSchema = z.object({
  roomId: z.number().optional(),
  userId: z.string(),
  lastSeen: z.string().transform((str) => new Date(str))
});

export const ChatMessageStatusPayloadSchema = z.object({
  roomId: z.number(),
  senderId: z.string(),
  messageId: z.number(),
  status: z.enum([
    TypesOfMsgsFromClientToWebSktSer.MessageRecieved,
    TypesOfMsgsFromClientToWebSktSer.MessageSeen
  ]),
  time: z
    .string()
    .transform((str) => new Date(str))
    .optional()
});
