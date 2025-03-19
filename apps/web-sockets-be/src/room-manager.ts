import {
  ChatMessageStatus,
  TypesOfMsgsFromClientToWebSktSer,
  UserActivity,
  UserStatus
} from "@repo/common";
import { ExtendedWebSocket } from ".";

export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<number, ExtendedWebSocket[]>;

  // Private constructor to prevent direct construction calls with the `new` operator
  constructor() {
    this.rooms = new Map<number, ExtendedWebSocket[]>();
  }

  // The static method that controls the access to the singleton instance
  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public getUsers(roomId: number) {
    return this.rooms.get(roomId);
  }

  public addUser(roomId: number, socket: ExtendedWebSocket) {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, []);
    if (this.rooms.get(roomId)!.some((ws) => ws.userId === socket.userId)) return;
    this.rooms.get(roomId)!.push(socket);
    console.log(`userId ${socket.userId} is added to the roomId ${roomId}`);
  }

  public removeUser(roomId: number, userId: string) {
    if (!this.rooms.get(roomId)) return;
    if (!this.rooms.get(roomId)!.some((ws) => ws.userId === userId)) return;
    this.rooms.set(
      roomId,
      this.rooms.get(roomId)!.filter((ws) => ws.userId !== userId)
    );
    console.log(`userId ${userId} is removed from the roomId ${roomId}`);
  }

  public length(roomId: number) {
    return this.rooms.get(roomId) ? this.rooms.get(roomId)?.length : 0;
  }

  public broadcastMessage(
    roomId: number,
    senderId: string,
    messageId: number,
    message: string,
    sentAt: Date
  ) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)!.forEach((socket) => {
      socket.send(
        JSON.stringify({
          type: TypesOfMsgsFromClientToWebSktSer.Chating,
          payload: { roomId, senderId, messageId, message, sentAt }
        })
      );
    });
    console.log("Message broadcasted over the roomId ", roomId);
  }

  public broadcastMessageStatus(
    roomId: number,
    senderId: string,
    messageId: number,
    status: ChatMessageStatus,
    time: Date
  ) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)!.forEach((socket) => {
      socket.send(
        JSON.stringify({
          type: status,
          payload: { roomId, senderId, messageId, status, time }
        })
      );
    });
    console.log("Message Status broadcasted over the roomId ", roomId);
  }

  public broadcastUserTypingActivity(roomId: number, userId: string) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)!.forEach((socket) => {
      if (socket.userId !== userId)
        socket.send(
          JSON.stringify({
            type: UserActivity.Typing,
            payload: { roomId, userId, status: UserActivity.Typing }
          })
        );
    });
    console.log("User Typing Activity broadcasted over the roomId ", roomId, " members.");
  }

  public broadcastUserOnlineStatus(roomId: number, userId: string) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)!.forEach((socket) => {
      if (socket.userId !== userId)
        socket.send(JSON.stringify({ type: UserStatus.Online, payload: { roomId, userId } }));
    });
    console.log("User Online Status broadcasted over the roomId ", roomId, " members.");
  }

  public broadcastUserOfflineStatus(roomId: number, userId: string, lastSeen: Date) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)!.forEach((socket) => {
      socket.send(
        JSON.stringify({ type: UserStatus.Offline, payload: { roomId, userId, lastSeen } })
      );
    });
    console.log("User Offline Status broadcasted over the roomId ", roomId, " members.");
  }
}
