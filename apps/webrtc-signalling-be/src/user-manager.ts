import { Logger } from "@repo/common/logger";
import type { ExtendedWebSocket } from "@repo/common/types";

export class UserManager {
  private static instance: UserManager;
  private userToSocketMap: Map<string, ExtendedWebSocket>;
  private logger: Logger;

  private constructor() {
    this.userToSocketMap = new Map<string, ExtendedWebSocket>();
    this.logger = new Logger();
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(socket: ExtendedWebSocket): void {
    this.userToSocketMap.set(socket.userId, socket);
    this.logger.info(`User ${socket.userId} added to user manager`);
    // this.logger.info(`User manager size: ${this.userToSocketMap.size}`);
  }

  public getSocket(userId: string): ExtendedWebSocket | undefined {
    return this.userToSocketMap.get(userId);
  }

  public removeUser(userId: string): void {
    this.userToSocketMap.delete(userId);
    this.logger.info(`User ${userId} removed from user manager`);
  }

  public isUserOnline(userId: string): boolean {
    return this.userToSocketMap.has(userId);
  }

  public length(): number {
    return this.userToSocketMap.size;
  }
}
