import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PORT, REDIS_MSG_QUEUE_KEY } from "./env";
import { PubSubManager } from "./pubsub-manager";
import { UserManager } from "./user-manager";
import { RoomManager } from "./room-manager";
import { redisPublisher, redisQueue, redisSubscriber } from "@repo/redis";
import { authenticate } from "@repo/common/auth-service";
import type {
  Client,
  ExtendedWebSocket,
  WebSocketsServerMessages,
} from "@repo/common/types";
import { Logger } from "@repo/common/logger";
import {
  ChatMessageSchema,
  ChatMessageReceivedSchema,
  ChatMessageSeenSchema,
  CreateRoomMessageSchema,
  JoinRoomsMessageSchema,
  UserTypingMessageSchema,
} from "@repo/common/validators";
import {
  DifferentMessageStatus,
  DifferentRoomMessages,
  UserActivity,
  UserRole,
  UserStatus,
} from "@repo/common/types";

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const pubSubManager = PubSubManager.getInstance();
const userManager = UserManager.getInstance();
const roomManager = RoomManager.getInstance();
const logger = new Logger();

const messageHandler = async (
  message: WebSocketsServerMessages,
  ws: ExtendedWebSocket
) => {
  try {
    if (message.type === DifferentRoomMessages.JoinRooms) {
      const joinRoomsMessage = JoinRoomsMessageSchema.parse(message);
      joinRoomsMessage.payload.roomIds.forEach((roomId) => {
        userManager.addRoomToUser(ws.userId, roomId);
        roomManager.addUserToRoom(roomId, ws);
        pubSubManager.subscribeRoomChannel(roomId);
        redisPublisher.publish(
          roomId,
          JSON.stringify({
            type: UserStatus.Online,
            payload: { roomId, userId: ws.userId },
          })
        );
      });
    } else if (message.type === UserActivity.Chatting) {
      const chatMessage = ChatMessageSchema.parse(message);
      redisQueue.lPush(REDIS_MSG_QUEUE_KEY, JSON.stringify(chatMessage));
    } else if (message.type === DifferentMessageStatus.Received) {
      const statusMessage = ChatMessageReceivedSchema.parse(message);
      redisQueue.lPush(REDIS_MSG_QUEUE_KEY, JSON.stringify(statusMessage));
    } else if (message.type === DifferentMessageStatus.Seen) {
      const statusMessage = ChatMessageSeenSchema.parse(message);
      redisQueue.lPush(REDIS_MSG_QUEUE_KEY, JSON.stringify(statusMessage));
    } else if (message.type === DifferentRoomMessages.CreateRoom) {
      if (ws.role !== UserRole.Donor) return;
      const newRoomMessage = CreateRoomMessageSchema.parse(message);
      userManager.addRoomToUser(ws.userId, newRoomMessage.payload.roomId);
      roomManager.addUserToRoom(newRoomMessage.payload.roomId, ws);
      pubSubManager.subscribeRoomChannel(newRoomMessage.payload.roomId);
      redisPublisher.publish(
        DifferentRoomMessages.CreateRoom,
        JSON.stringify(newRoomMessage)
      );
    } else if (message.type === UserActivity.Typing) {
      const userTyping = UserTypingMessageSchema.parse(message);
      redisPublisher.publish(
        userTyping.payload.roomId,
        JSON.stringify(userTyping)
      );
    }
  } catch (error) {
    logger.error(`Error processing message: ${JSON.stringify(message)}`);
  }
};

wss.on(
  "connection",
  async (ws: ExtendedWebSocket, request: IncomingMessage, client: Client) => {
    ws.userId = client.userId;
    ws.name = client.name;
    ws.role = client.role;
    ws.email = client.email;
    ws.image = client.image;

    userManager.addUser(ws);
    redisQueue.lPush(
      REDIS_MSG_QUEUE_KEY,
      JSON.stringify({
        type: UserStatus.Online,
        payload: { userId: ws.userId },
      })
    );

    ws.on("error", console.error);

    ws.on("message", async (data: string | Buffer) => {
      // TODO: add rate limitting logic here
      console.log(`Received message ${data} from user ${ws.userId}`);
      try {
        await messageHandler(JSON.parse(data as string), ws);
      } catch (error) {
        logger.error("Error processing message: ", error);
      }
    });

    ws.on("close", () => {
      try {
        redisQueue.lPush(
          REDIS_MSG_QUEUE_KEY,
          JSON.stringify({
            type: UserStatus.Offline,
            payload: { userId: ws.userId },
          })
        );
        const rooms = userManager.getRooms(ws.userId);
        rooms?.forEach((roomId) => {
          roomManager.removeUserFromRoom(roomId, ws.userId);
          if (roomManager.length(roomId) === 0)
            pubSubManager.unsubscribeRoomChannel(roomId);
          redisPublisher.publish(
            roomId,
            JSON.stringify({
              type: UserStatus.Offline,
              payload: { userId: ws.userId, roomId },
            })
          );
        });
        logger.info(`WebSocket connection closed for user ${ws.userId}`);
      } catch (err) {
        logger.error("WebSocket connection Closing time error: ", err);
      }
    });
  }
);

redisSubscriber.subscribe(DifferentRoomMessages.CreateRoom, (msg) => {
  try {
    console.log("STEP 1", msg);
    const message: WebSocketsServerMessages = JSON.parse(msg);
    if (
      message.type !== DifferentRoomMessages.CreateRoom ||
      !userManager.getSocket(message.payload.applicantId)
    )
      return;
    console.log("STEP 2", msg);
    const applicant = userManager.getSocket(message.payload.applicantId);
    if (!applicant) return;
    console.log("STEP 3", applicant);
    const createRoomMessage = CreateRoomMessageSchema.parse(message);
    console.log("STEP 4", createRoomMessage);
    applicant.send(
      JSON.stringify({
        type: createRoomMessage.type,
        payload: {
          roomId: createRoomMessage.payload.roomId,
          roomName: createRoomMessage.payload.donorName,
          image: createRoomMessage.payload.donorImage,
          unreadMessages: 0,
          messages: [],
          participant: {
            id: createRoomMessage.payload.donorId,
            isOnline: true,
            isTyping: false,
          },
        },
      })
    );
    console.log("STEP 5", applicant);
  } catch (error) {
    logger.error("Error processing create room message: ", error);
    console.log("STEP 6", error);
  }
});

server.on("upgrade", (request: IncomingMessage, socket, head) => {
  socket.on("error", console.error);
  // console.log("STEP 1", request);

  authenticate(request, (err, client: Client | null) => {
    if (err || !client) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    socket.removeListener("error", console.error);

    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      wss.emit("connection", ws, request, client);
    });
  });
});

server.listen(PORT, () => {
  logger.info(`Server is listening at: http://localhost:${PORT}`); // TODO: add it to env file 192.168.1.7
});
