import { z } from "zod";
import {
  DifferentMessageStatus,
  DifferentRoomMessages,
  DifferentWebRTCSignallingServerMessages,
  UserActivity,
  UserStatus,
} from "./types";

// WORKER SERVER INPUTS FROM REDIS QUEUE VALIDATORS
export const UserOfflineSchema = z.object({
  type: z.literal(UserStatus.Offline),
  payload: z.object({
    userId: z.string(),
  }),
});

export const UserOnlineSchema = z.object({
  type: z.literal(UserStatus.Online),
  payload: z.object({
    userId: z.string(),
  }),
});

export const ChatMessageSchema = z.object({
  type: z.literal(UserActivity.Chatting),
  payload: z.object({
    roomId: z.string(),
    senderId: z.string(),
    content: z.string(),
  }),
});

export const ChatResponseSchema = z.object({
  type: z.literal(UserActivity.Chatting),
  payload: z.object({
    roomId: z.string(),
    senderId: z.string(),
    content: z.string(),
    messageId: z.string(),
    sentAt: z.date(),
  }),
});

export const ChatMessageReceivedSchema = z.object({
  type: z.literal(DifferentMessageStatus.Received),
  payload: z.object({
    roomId: z.string(),
    senderId: z.string(),
    messageId: z.string(),
  }),
});

export const ChatMessageSeenSchema = z.object({
  type: z.literal(DifferentMessageStatus.Seen),
  payload: z.object({
    roomId: z.string(),
    senderId: z.string(),
  }),
});

export const UserOnboardingSchema = z.object({
  type: z.literal(UserActivity.OnboardingEmail),
  payload: z.object({
    donorEmail: z.string(),
    donorName: z.string(),
  }),
});

export const WorkerMessagesSchema = z.union([
  ChatMessageSchema,
  ChatMessageReceivedSchema,
  ChatMessageSeenSchema,
  UserOfflineSchema,
  UserOnlineSchema,
  UserOnboardingSchema,
]);

export const WorkerResponsesSchema = ChatResponseSchema;

// WEBRTC SIGNALLING SERVER VALIDATORS
export const ConsentMessageSchema = z.object({
  type: z.literal(DifferentWebRTCSignallingServerMessages.Consent),
  payload: z.object({
    donorId: z.string(),
    donorName: z.string(),
    donorImage: z.string(),
    applicantId: z.string(),
  }),
});

export const PermissionMessageSchema = z.object({
  type: z.literal(DifferentWebRTCSignallingServerMessages.Permission),
  payload: z.object({
    donorId: z.string(),
    applicantPeerId: z.string(),
  }),
});

export const BusyMessageSchema = z.object({
  type: z.literal(DifferentWebRTCSignallingServerMessages.Busy),
  payload: z.object({
    donorId: z.string(),
  }),
});

export const ErrorMessageSchema = z.object({
  type: z.literal(DifferentWebRTCSignallingServerMessages.Error),
  payload: z.null(),
});

export const WebRTCSignallingServerMessagesSchema = z.union([
  ConsentMessageSchema,
  PermissionMessageSchema,
  BusyMessageSchema,
  ErrorMessageSchema,
]);

// WEB SOCKET SERVER INPUTS FROM CLIENT VALIDATORS
export const JoinRoomsMessageSchema = z.object({
  type: z.literal(DifferentRoomMessages.JoinRooms),
  payload: z.object({
    roomIds: z.array(z.string()),
  }),
});

// export const LeaveRoomsMessageSchema = z.object({
//   type: z.literal(DifferentRoomMessages.LeaveRooms),
//   payload: z.object({
//     roomIds: z.array(z.string()),
//   }),
// });

export const UserTypingMessageSchema = z.object({
  type: z.literal(UserActivity.Typing),
  payload: z.object({
    roomId: z.string(),
    userId: z.string(),
  }),
});

export const CreateRoomMessageSchema = z.object({
  type: z.literal(DifferentRoomMessages.CreateRoom),
  payload: z.object({
    applicantId: z.string(),
    donorId: z.string(),
    donorName: z.string(),
    donorImage: z.string(),
    roomId: z.string(),
  }),
});

const CreateRoomResponseSchema = z.object({
  type: z.literal(DifferentRoomMessages.CreateRoom),
  payload: z.object({
    roomId: z.string(),
    roomName: z.string(),
    image: z.string(),
    unreadMessages: z.number(),
    messages: z.array(z.any()),
    participant: z.object({
      id: z.string(),
      isOnline: z.boolean(),
      isTyping: z.boolean(),
    }),
  }),
});

export const WebSocketsServerMessagesSchema = z.union([
  JoinRoomsMessageSchema,
  // LeaveRoomsMessageSchema,
  CreateRoomMessageSchema,
  ChatMessageSchema,
  ChatMessageReceivedSchema,
  ChatMessageSeenSchema,
  UserOnlineSchema,
  UserTypingMessageSchema,
  UserOfflineSchema,
]);

// WEBSOCKET SERVER INPUTS FROM PUBSUB VALIDATORS
export const WebSocketsServerResponsesSchema = z.union([
  UserOnlineSchema,
  ChatResponseSchema,
  CreateRoomResponseSchema,
  ChatMessageReceivedSchema,
  ChatMessageSeenSchema,
  UserTypingMessageSchema,
  UserOfflineSchema,
]);
