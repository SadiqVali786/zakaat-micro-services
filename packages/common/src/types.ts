import { z } from "zod";
import {
  ChatMessagePayloadSchema,
  JoinRoomsMessagePayloadSchema,
  LeaveRoomsMessagePayloadSchema,
  ChatMessageStatusPayloadSchema,
  TypesOfMsgsFromClientToWebSktSer,
  TypesOfMsgsFromPubSubToWebSktSer,
  TypesOfMsgsFromWebSktSerToClient,
  UserTypingPayloadSchema,
  UserOnlinePayloadSchema,
  UserOfflinePayloadSchema,
  TypesOfMsgsFromMsgQueueToWorker,
  NewRoomMessagePayloadSchema,
  ClientNewRoomSchema
} from "./validators";

export type ClientToWebSktSerMsgsSchema =
  | {
      type: TypesOfMsgsFromClientToWebSktSer.JoinRooms;
      payload: z.infer<typeof JoinRoomsMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.Chating;
      payload: z.infer<typeof ChatMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.LeaveRooms;
      payload: z.infer<typeof LeaveRoomsMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.MessageRecieved;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.MessageSeen;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.CreateRoom;
      payload: z.infer<typeof NewRoomMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.Online;
      payload: z.infer<typeof UserOnlinePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromClientToWebSktSer.Typing;
      payload: z.infer<typeof UserTypingPayloadSchema>;
    };

export type WebSktSerToClientMsgsSchema =
  | {
      type: TypesOfMsgsFromWebSktSerToClient.Chating;
      payload: z.infer<typeof ChatMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.MessageRecieved;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.MessageSeen;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.Typing;
      payload: z.infer<typeof UserTypingPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.Online;
      payload: z.infer<typeof UserOnlinePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.Offline;
      payload: z.infer<typeof UserOfflinePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromWebSktSerToClient.CreateRoom;
      payload: z.infer<typeof ClientNewRoomSchema>;
    };

export type PubSubToWebSktSerMsgsSchema =
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.Chating;
      payload: z.infer<typeof ChatMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.MessageRecieved;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.MessageSeen;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.Online;
      payload: z.infer<typeof UserOnlinePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.Offline;
      payload: z.infer<typeof UserOfflinePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.Typing;
      payload: z.infer<typeof UserTypingPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromPubSubToWebSktSer.CreateRoom;
      payload: z.infer<typeof NewRoomMessagePayloadSchema>;
    };

export type MsgQueueToWorkerMsgsSchema =
  | {
      type: TypesOfMsgsFromMsgQueueToWorker.Chating;
      payload: z.infer<typeof ChatMessagePayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromMsgQueueToWorker.MessageRecieved;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromMsgQueueToWorker.MessageSeen;
      payload: z.infer<typeof ChatMessageStatusPayloadSchema>;
    }
  | {
      type: TypesOfMsgsFromMsgQueueToWorker.Offline;
      payload: z.infer<typeof UserOfflinePayloadSchema>;
    };
