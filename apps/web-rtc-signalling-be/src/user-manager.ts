import { ExtendedWebSocket } from ".";

export class UserManager {
  private static instance: UserManager;
  private userToSocketMap: Map<string, ExtendedWebSocket>;

  constructor() {
    this.userToSocketMap = new Map<string, ExtendedWebSocket>();
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) UserManager.instance = new UserManager();
    return UserManager.instance;
  }

  public addUser(socket: ExtendedWebSocket) {
    this.userToSocketMap.set(socket.userId, socket);
    console.log(`A new user ${socket.userId} added to the user-manager`);
  }

  public getSocket(userId: string) {
    return this.userToSocketMap.get(userId);
  }

  public removeUser(userId: string) {
    this.userToSocketMap.delete(userId);
    console.log(`user ${userId} removed from the user-manager`);
  }

  public length() {
    return this.userToSocketMap.size;
  }
}
