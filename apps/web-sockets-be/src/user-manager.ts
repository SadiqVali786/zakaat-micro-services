import type { ExtendedWebSocket } from "@repo/common/types";
import { Logger } from "@repo/common/logger";

export class UserManager {
  private static instance: UserManager;
  private logger = new Logger();
  private usersToRoomsMap = new Map<string, Set<string>>();
  private userToSocketMap = new Map<string, ExtendedWebSocket>();

  // private constructor to prevent instantiation
  private constructor() {}

  // The static method that returns the singleton instance
  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(socket: ExtendedWebSocket): void {
    const { userId } = socket;
    if (this.userToSocketMap.has(userId)) return;

    this.userToSocketMap.set(userId, socket);
    this.usersToRoomsMap.set(userId, new Set());
    this.logger.info(`A new user ${userId} added to the user-manager`);
  }

  public getSocket(userId: string): ExtendedWebSocket | undefined {
    return this.userToSocketMap.get(userId);
  }

  public getRooms(userId: string): Set<string> | undefined {
    return this.usersToRoomsMap.get(userId);
  }

  public removeUser(userId: string): void {
    this.userToSocketMap.delete(userId);
    if (this.usersToRoomsMap.delete(userId)) {
      this.logger.info(`user ${userId} removed from the user-manager`);
    }
  }

  public addRoomToUser(userId: string, roomId: string): void {
    const userRooms = this.usersToRoomsMap.get(userId);
    if (!userRooms) return;

    if (userRooms.add(roomId)) {
      this.logger.info(
        `a new room ${roomId} is added to the user ${userId} in user-manager`
      );
    }
  }

  public removeRoomFromUser(userId: string, roomId: string): void {
    const userRooms = this.usersToRoomsMap.get(userId);
    if (!userRooms) return;

    if (userRooms.delete(roomId)) {
      this.logger.info(
        `room ${roomId} is removed from user ${userId} in user-manager`
      );
    }
  }

  public length(userId: string): number {
    return this.usersToRoomsMap.get(userId)?.size ?? 0;
  }
}
