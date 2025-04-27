import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PORT } from "./env";
import { UserManager } from "./user-manager";
import {
  type ExtendedWebSocket,
  type Client,
  DifferentWebRTCSignallingServerMessages
} from "@repo/common/types";
import { MessageHandler } from "./message-handler";
import { Logger } from "@repo/common/logger";
import { authenticate } from "@repo/common/auth-service";
import { printEnvironmentVariables } from "@repo/common/print-env-variables";

const logger = new Logger();
const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const userManager = UserManager.getInstance();
const messageHandler = MessageHandler.getInstance();

printEnvironmentVariables();

wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage, client: Client) => {
  // Initialize socket with user data
  ws.userId = client.userId;
  ws.name = client.name;
  ws.role = client.role;
  ws.email = client.email;
  ws.image = client.image;

  // Add user and socket to user manager
  userManager.addUser(ws);

  ws.on("error", console.error);

  ws.on("message", async (message: string) => {
    // TODO: add rate limitting logic here
    try {
      await messageHandler.handleMessage(ws, message);
    } catch (error) {
      logger.error("Error handling message:", error);
      ws.send(
        JSON.stringify({
          type: DifferentWebRTCSignallingServerMessages.Error,
          payload: null
        })
      );
    }
  });

  // Event listener for when a client disconnects
  ws.on("close", () => {
    userManager.removeUser(ws.userId);
  });
});

server.on("upgrade", (request: IncomingMessage, socket, head) => {
  socket.on("error", console.error);

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
  console.log(`WebRTC Signaling Server running at: http://localhost:${PORT}`);
});
