import { RoomManager } from "./room-manager";
import { UserManager } from "./user-manager";
import { redisSubscriber } from "@repo/redis";
import { Logger } from "@repo/common/logger";
import {
  DifferentMessageStatus,
  UserStatus,
  UserActivity,
  type WebSocketsServerResponses,
} from "@repo/common/types";

export class PubSubManager {
  private static instance: PubSubManager;
  private logger = new Logger();
  private activeSubscriptions = new Set<string>();
  private roomManager = RoomManager.getInstance();
  private userManager = UserManager.getInstance();

  // Private constructor to prevent direct construction calls with the `new` operator
  private constructor() {}

  // The static method that controls the access to the singleton instance
  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  public subscribeRoomChannel(roomId: string) {
    if (this.activeSubscriptions.has(roomId)) return;
    this.activeSubscriptions.add(roomId);
    redisSubscriber.subscribe(roomId, (msg) => {
      const message: WebSocketsServerResponses = JSON.parse(msg);
      this.handleRoomMessage(message);
    });
    this.logger.info(`Subscribed to Redis roomId channel: ${roomId}`);
  }

  public unsubscribeRoomChannel(roomId: string) {
    redisSubscriber.unsubscribe(roomId);
    this.activeSubscriptions.delete(roomId);
    this.logger.info(`UnSubscribed from Redis channel: ${roomId}`);
  }

  // Define the method that will be called when a message is published to the subscribed roomId channel
  private handleRoomMessage(message: WebSocketsServerResponses) {
    if (message.type === UserActivity.Chatting) {
      console.log("STEP 1 : PUBSUB CHAT MESSAGE", message);
      this.roomManager.broadcastMessage(
        message.payload.roomId,
        message.payload.senderId,
        message.payload.messageId,
        message.payload.content,
        message.payload.sentAt
      );
    } else if (message.type === DifferentMessageStatus.Received) {
      this.roomManager.broadcastMessageReceivedStatus(
        message.payload.roomId,
        message.payload.senderId,
        message.payload.messageId
      );
    } else if (message.type === DifferentMessageStatus.Seen) {
      this.roomManager.broadcastMessageSeenStatus(
        message.payload.roomId,
        message.payload.senderId
      );
    } else if (message.type === UserActivity.Typing) {
      this.roomManager.broadcastUserTypingActivity(
        message.payload.roomId,
        message.payload.userId
      );
    } else if (message.type === UserStatus.Online) {
      const { userId } = message.payload;
      const rooms = this.userManager.getRooms(userId);
      if (!rooms) return;
      for (const roomId of rooms) {
        this.roomManager.broadcastUserOnlineStatus(roomId, userId);
      }
    } else if (message.type === UserStatus.Offline) {
      const { userId } = message.payload;
      const rooms = this.userManager.getRooms(userId);
      if (!rooms) return;
      for (const roomId of rooms) {
        this.roomManager.broadcastUserOfflineStatus(roomId, userId);
      }
      this.userManager.removeUser(userId);
    }
  }
}
