import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PORT } from "./env";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { verifyJWT } from "@repo/common/verify-jwt";

type Client = {
  userId: string;
  avatar: string;
  role: string;
  fullname: string;
};

export type ExtendedWebSocket = WebSocket & {
  userId: string;
  role: string;
  avatar: string;
  fullname: string;
};

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

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
    if (decoded?.userId) {
      const client: Client = {
        userId: decoded.userId as string,
        role: decoded.role as string,
        avatar: decoded.avatar as string,
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

wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage, client: Client) => {
  ws.on("error", console.error);

  ws.on("message", async (data: string | Buffer) => {
    console.log(`Received message ${data} from user ${client}`);
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
