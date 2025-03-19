import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PORT, REDIS_MSG_QUEUE_KEY } from "./env";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { verifyJWT } from "@repo/common/verify-jwt";
import { UserRole } from "@repo/mongodb";
import { PubSubManager } from "./pubsub-manager";
import { UserManager } from "./user-manager";
import { RoomManager } from "./room-manager";
import { ClientToWebSktSerMsgsSchema } from "@repo/common/types";
import { redisPublisher, redisQueue } from "@repo/redis";
import {
  ChatMessagePayloadSchema,
  ChatMessageStatusPayloadSchema,
  JoinRoomsMessagePayloadSchema,
  LeaveRoomsMessagePayloadSchema,
  NewRoomMessagePayloadSchema,
  TypesOfMsgsFromClientToWebSktSer,
  TypesOfMsgsFromMsgQueueToWorker,
  UserStatus,
  UserTypingPayloadSchema
} from "@repo/common/validators";

type Client = {
  userId: string;
  email: string;
  picture: string;
  fullname: string;
  role: UserRole;
};

export type ExtendedWebSocket = WebSocket & {
  userId: string;
  email: string;
  role: UserRole;
  picture: string;
  fullname: string;
};

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const pubSubManager = PubSubManager.getInstance();
const userManager = UserManager.getInstance();
const roomManager = RoomManager.getInstance();

const authenticate = async (
  request: IncomingMessage,
  next: (err: Error | null, client: Client | null) => void
) => {
  const url = request.url;
  if (!url) return;
  const urlParts = url.split("?");
  if (urlParts.length < 2) return; // No query parameters
  const queryParams = new URLSearchParams(urlParts[1]);
  const token = queryParams.get("token") || "";
  if (!token) {
    next(new Error("Token is required"), null);
    return;
  }
  // console.log("Recieved Token: ", token);
  // TODO: make a DB call to verify the token validity
  try {
    const decoded = (await verifyJWT(token)) as JWTPayload;
    // console.log("Decoded data from the token = ", decoded);
    if (decoded?.sub) {
      const client: Client = {
        userId: decoded.userId as string,
        role: decoded.role as UserRole,
        email: decoded.email as string,
        picture: decoded.picture as string,
        fullname: decoded.fullname as string
      };
      next(null, client);
    }
  } catch (error) {
    if (error instanceof JOSEError) {
      next(new Error("Token expired"), null);
    }
    console.log(error);
    next(new Error("Unauthorized"), null);
  }
};

const messageHandler = async (message: ClientToWebSktSerMsgsSchema, ws: ExtendedWebSocket) => {
  console.log(message);
  try {
    if (message.type === TypesOfMsgsFromClientToWebSktSer.JoinRooms) {
      const joinRoomsMessagePayload = JoinRoomsMessagePayloadSchema.parse(message.payload);
      joinRoomsMessagePayload.roomIds.forEach((roomId) => {
        userManager.addRoom(ws.userId, roomId);
        roomManager.addUser(roomId, ws);
        pubSubManager.subscribeRoomChannel(roomId);
        redisPublisher.publish(
          roomId.toString(),
          JSON.stringify({
            type: UserStatus.Online,
            payload: { roomId, userId: ws.userId }
          })
        );
      });
    } else if (message.type === TypesOfMsgsFromClientToWebSktSer.LeaveRooms) {
      const leaveRoomsMessagePayload = LeaveRoomsMessagePayloadSchema.parse(message.payload);
      leaveRoomsMessagePayload.roomIds.forEach((roomId) => {
        userManager.removeRoom(ws.userId, roomId);
        roomManager.removeUser(roomId, ws.userId);
        if (roomManager.length(roomId) === 0) pubSubManager.unsubscribeRoomChannel(roomId);
      });
    } else if (message.type === TypesOfMsgsFromClientToWebSktSer.Chating) {
      const chatMessagePayload = ChatMessagePayloadSchema.parse(message.payload);
      redisQueue.lPush(
        REDIS_MSG_QUEUE_KEY,
        JSON.stringify({
          type: message.type,
          payload: {
            ...chatMessagePayload,
            sentAt: new Date()
          }
        })
      );
    } else if (
      message.type === TypesOfMsgsFromClientToWebSktSer.MessageRecieved ||
      message.type === TypesOfMsgsFromClientToWebSktSer.MessageSeen
    ) {
      const statusMessage = ChatMessageStatusPayloadSchema.parse(message.payload);
      redisQueue.lPush(
        REDIS_MSG_QUEUE_KEY,
        JSON.stringify({
          type: message.type,
          payload: {
            ...statusMessage,
            time: new Date()
          }
        })
      );
    } else if (message.type === TypesOfMsgsFromClientToWebSktSer.CreateRoom) {
      if (ws.role !== UserRole.Donor) return;
      const newRoomMessage = NewRoomMessagePayloadSchema.parse(message.payload);
      userManager.addRoom(ws.userId, newRoomMessage.roomId);
      roomManager.addUser(newRoomMessage.roomId, ws);
      pubSubManager.subscribeRoomChannel(newRoomMessage.roomId);
      redisPublisher.publish(
        TypesOfMsgsFromClientToWebSktSer.CreateRoom,
        JSON.stringify({
          type: TypesOfMsgsFromClientToWebSktSer.CreateRoom,
          payload: {
            roomId: newRoomMessage.roomId,
            applicantId: newRoomMessage.applicantId,
            donorId: ws.userId
          }
        })
      );
    } else if (message.type === TypesOfMsgsFromClientToWebSktSer.Typing) {
      const userTypingPayload = UserTypingPayloadSchema.parse(message.payload);
      redisPublisher.publish(userTypingPayload.roomId.toString(), JSON.stringify(message));
    }
  } catch (error) {
    console.log(`Error processing message: ${JSON.stringify(message)}`);
    console.log(error);
  }
};

wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage, client: Client) => {
  ws.userId = client.userId;
  ws.fullname = client.fullname;
  ws.role = client.role;
  ws.picture = client.picture;

  userManager.addUser(ws);

  ws.on("error", console.error);

  ws.on("message", async (data: string | Buffer) => {
    // TODO: add rate limitting logic here
    // console.log(`Received message ${data} from user ${ws.userId}`);
    try {
      await messageHandler(JSON.parse(data as string), ws);
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    try {
      redisQueue.lPush(
        REDIS_MSG_QUEUE_KEY,
        JSON.stringify({
          type: TypesOfMsgsFromMsgQueueToWorker.Offline,
          payload: { userId: ws.userId, lastSeen: new Date() }
        })
      );
      const rooms = userManager.getRooms(ws.userId);
      rooms?.forEach((roomId) => {
        roomManager.removeUser(roomId, ws.userId);
        if (roomManager.length(roomId) === 0) pubSubManager.unsubscribeRoomChannel(roomId);
        redisPublisher.publish(
          roomId.toString(),
          JSON.stringify({
            type: TypesOfMsgsFromMsgQueueToWorker.Offline,
            payload: { userId: ws.userId, roomId, lastSeen: new Date() }
          })
        );
      });
      userManager.removeUser(ws.userId);
      console.log(`WebSocket connection closed for user ${ws.userId}`);
    } catch (err) {
      console.error("WebSocket connection Closing time error: ", err);
    }
  });
});

server.on("upgrade", (request: IncomingMessage, socket, head) => {
  socket.on("error", (error: Error) => console.error(error));

  authenticate(request, (err, client: Client | null) => {
    if (err || !client) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    socket.removeListener("error", (error: Error) => console.error(error));

    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      wss.emit("connection", ws, request, client);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening at: http://localhost:${PORT}`);
});
