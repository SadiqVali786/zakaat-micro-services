import type { ExtendedWebSocket } from "@repo/common/types";
import { Logger } from "@repo/common/logger";
import {
  UserActivity,
  UserStatus,
  DifferentMessageStatus,
} from "@repo/common/types";

export class RoomManager {
  private static instance: RoomManager;
  private rooms = new Map<string, Map<string, ExtendedWebSocket>>();
  private logger = new Logger();

  // Private constructor to prevent direct construction calls with the `new` operator
  private constructor() {}

  // The static method that controls the access to the singleton instance
  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  // Helper method to check if room exists and get it, or create new
  private getOrCreateRoom(roomId: string): Map<string, ExtendedWebSocket> {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }
    return this.rooms.get(roomId)!;
  }

  // Helper method for broadcasting messages to room members
  private broadcast(
    roomId: string,
    message: any,
    excludeUserId?: string
  ): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.forEach((socket, userId) => {
      if (userId !== excludeUserId) {
        socket.send(JSON.stringify(message));
      }
    });
  }

  public getRoomUsers(
    roomId: string
  ): IterableIterator<ExtendedWebSocket> | undefined {
    return this.rooms.get(roomId)?.values();
  }

  public addUserToRoom(roomId: string, socket: ExtendedWebSocket): void {
    const room = this.getOrCreateRoom(roomId);
    room.set(socket.userId, socket);
    this.logger.info(
      `userId ${socket.userId} is added to the roomId ${roomId}`
    );
  }

  public removeUserFromRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room?.delete(userId)) {
      this.logger.info(`userId ${userId} is removed from the roomId ${roomId}`);
    }
  }

  public length(roomId: string): number {
    return this.rooms.get(roomId)?.size ?? 0;
  }

  public broadcastMessage(
    roomId: string,
    senderId: string,
    messageId: string,
    content: string,
    sentAt: Date
  ): void {
    this.broadcast(roomId, {
      type: UserActivity.Chatting,
      payload: { roomId, senderId, messageId, content, sentAt },
    });
    this.logger.info("Message broadcasted over the roomId ", roomId);
  }

  public broadcastMessageReceivedStatus(
    roomId: string,
    senderId: string,
    messageId: string
  ): void {
    this.broadcast(roomId, {
      type: DifferentMessageStatus.Received,
      payload: { roomId, senderId, messageId },
    });
    this.logger.info("Message Status broadcasted over the roomId ", roomId);
  }

  public broadcastMessageSeenStatus(roomId: string, senderId: string): void {
    this.broadcast(roomId, {
      type: DifferentMessageStatus.Seen,
      payload: { roomId, senderId },
    });
    this.logger.info("Message Status broadcasted over the roomId ", roomId);
  }

  public broadcastUserTypingActivity(roomId: string, userId: string): void {
    this.broadcast(
      roomId,
      {
        type: UserActivity.Typing,
        payload: { roomId, userId, status: UserActivity.Typing },
      },
      userId
    );
    this.logger.info(
      "User Typing Activity broadcasted over the roomId ",
      roomId,
      " members."
    );
  }

  public broadcastUserOnlineStatus(roomId: string, userId: string): void {
    this.broadcast(
      roomId,
      {
        type: UserStatus.Online,
        payload: { roomId, userId },
      },
      userId
    );
    this.logger.info(
      "User Online Status broadcasted over the roomId ",
      roomId,
      " members."
    );
  }

  public broadcastUserOfflineStatus(roomId: string, userId: string): void {
    this.broadcast(roomId, {
      type: UserStatus.Offline,
      payload: { roomId, userId },
    });
    this.logger.info(
      "User Offline Status broadcasted over the roomId ",
      roomId,
      " members."
    );
  }
}
