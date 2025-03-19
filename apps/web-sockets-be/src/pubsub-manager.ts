import { RoomManager } from "./room-manager";
import { TypesOfMsgsFromPubSubToWebSktSer } from "@repo/common";
import { PubSubToWebSktSerMsgsSchema } from "@repo/common";
import { redisSubscriber } from "@repo/redis";

export class PubSubManager {
  private roomManager = RoomManager.getInstance();
  private static instance: PubSubManager;
  private activeSubscriptions = new Set<string>();

  // Private constructor to prevent direct construction calls with the `new` operator
  private constructor() {}

  // The static method that controls the access to the singleton instance
  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  public subscribeRoomChannel(roomId: number) {
    if (!this.activeSubscriptions.has(roomId.toString())) {
      this.activeSubscriptions.add(roomId.toString());
      redisSubscriber.subscribe(roomId.toString(), (msg) => {
        const message: PubSubToWebSktSerMsgsSchema = JSON.parse(msg);
        this.handleRoomMessage(message);
      });
      console.log(`Subscribed to Redis roomId channel: ${roomId}`);
    }
  }

  public unsubscribeRoomChannel(roomId: number) {
    redisSubscriber.unsubscribe(roomId.toString());
    this.activeSubscriptions.delete(roomId.toString());
    console.log(`UnSubscribed from Redis channel: ${roomId}`);
  }

  // Define the method that will be called when a message is published to the subscribed roomId channel
  private handleRoomMessage(message: PubSubToWebSktSerMsgsSchema) {
    if (message.type === TypesOfMsgsFromPubSubToWebSktSer.Chating) {
      this.roomManager.broadcastMessage(
        message.payload.roomId,
        message.payload.senderId,
        message.payload.messageId!,
        message.payload.message,
        message.payload.sentAt!
      );
    } else if (
      message.type === TypesOfMsgsFromPubSubToWebSktSer.MessageRecieved ||
      message.type === TypesOfMsgsFromPubSubToWebSktSer.MessageSeen
    ) {
      this.roomManager.broadcastMessageStatus(
        message.payload.roomId,
        message.payload.senderId,
        message.payload.messageId,
        // @ts-ignore
        message.payload.status,
        message.payload.time
      );
    } else if (message.type === TypesOfMsgsFromPubSubToWebSktSer.Typing) {
      this.roomManager.broadcastUserTypingActivity(message.payload.roomId, message.payload.userId);
    } else if (message.type === TypesOfMsgsFromPubSubToWebSktSer.Online) {
      const { roomId, userId } = message.payload;
      this.roomManager.broadcastUserOnlineStatus(roomId, userId);
    } else if (message.type === TypesOfMsgsFromPubSubToWebSktSer.Offline) {
      const { roomId, userId, lastSeen } = message.payload;
      this.roomManager.broadcastUserOfflineStatus(roomId!, userId, lastSeen);
    }
  }
}
