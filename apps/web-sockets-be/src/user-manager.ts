import { ExtendedWebSocket } from ".";

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, number[]>;
  private userToSocketMap: Map<string, ExtendedWebSocket>;

  // Private constructor to prevent direct construction calls with the `new` operator
  constructor() {
    this.users = new Map<string, number[]>();
    this.userToSocketMap = new Map<string, ExtendedWebSocket>();
  }

  // The static method that controls the access to the singleton instance
  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(socket: ExtendedWebSocket) {
    if (this.userToSocketMap.get(socket.userId)) return;
    this.userToSocketMap.set(socket.userId, socket);
    this.users.set(socket.userId, []);
    console.log(`A new user ${socket.userId} added to the user-manager`);
  }

  public getSocket(userId: string) {
    return this.userToSocketMap.get(userId);
  }

  public getRooms(userId: string) {
    return this.users.get(userId);
  }

  public removeUser(userId: string) {
    this.userToSocketMap.delete(userId);
    if (!this.users.get(userId)) return;
    this.users.delete(userId);
    console.log(`user ${userId} removed from the user-manager`);
  }

  public addRoom(userId: string, roomId: number) {
    if (!this.users.get(userId) || this.users.get(userId)!.some((x) => x === roomId)) return;
    this.users.get(userId)!.push(roomId);
    console.log(`a new room ${roomId} is added to the user ${userId} in user-manager`);
  }

  public removeRoom(userId: string, roomId: number) {
    if (!this.users.get(userId) || !this.users.get(userId)!.some((x) => x === roomId)) return;
    this.users.set(
      userId,
      this.users.get(userId)!.filter((x) => x !== roomId)
    );
    console.log(`room ${roomId} is removed from user ${userId} in user-manager`);
  }

  public length(userId: string) {
    return this.users.get(userId)?.length;
  }
}
