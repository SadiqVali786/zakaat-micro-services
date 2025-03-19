import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PORT } from "./env";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { verifyJWT } from "@repo/common/verify-jwt";
import { UserRole } from "@repo/mongodb";
import { UserManager } from "./user-manager";
import {
  applicantToServerBusySchema,
  applicantToServerBusyType,
  applicantToServerPermissionSchema,
  applicantToServerPermissionType,
  donorToServerConsentSchema,
  donorToServerConsentType,
  TypesOfMsgsFromApplicantToServer,
  TypesOfMsgsFromDonorToServer,
  TypesOfMsgsFromServerToApplicant
} from "./types";

type Client = {
  sub: string;
  email: string;
  picture: string;
  name: string;
  role: UserRole;
};

export type ExtendedWebSocket = WebSocket & {
  userId: string;
  email: string;
  role: string;
  picture: string;
  fullname: string;
};

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const userManager = UserManager.getInstance();

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
        sub: decoded.sub as string,
        role: decoded.role as UserRole,
        picture: decoded.picture as string,
        name: decoded.name as string,
        email: decoded.email as string
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
  ws.userId = client.sub;
  ws.fullname = client.name;
  ws.role = client.role;
  ws.picture = client.picture;

  userManager.addUser(ws);

  ws.on("error", console.error);

  // Event listener for incoming messages from the client
  ws.on("message", async (message: string) => {
    // console.log(`Received message ${data} from user ${client}`);
    // TODO: add rate limitting logic here
    try {
      const parsedMessage:
        | donorToServerConsentType
        | applicantToServerPermissionType
        | applicantToServerBusyType = JSON.parse(message);
      if (parsedMessage.type === TypesOfMsgsFromDonorToServer.consent) {
        if (ws.role !== UserRole.Donor) return;
        const payload = donorToServerConsentSchema.parse(parsedMessage.payload);
        const socket = userManager.getSocket(payload.applicantId);
        socket?.send(
          JSON.stringify({
            type: TypesOfMsgsFromServerToApplicant.consent,
            payload: {
              donorId: ws.userId,
              fullname: ws.fullname,
              picture: ws.picture
            }
          })
        );
      } else if (parsedMessage.type === TypesOfMsgsFromApplicantToServer.busy) {
        if (ws.role !== UserRole.Applicant) return;
        const payload = applicantToServerBusySchema.parse(parsedMessage.payload);
        const socket = userManager.getSocket(payload.donorId);
        socket?.send(
          JSON.stringify({
            type: parsedMessage.type,
            payload: {
              applicantId: ws.userId,
              fullname: ws.fullname,
              avatar: ws.picture,
              status: payload.status
            }
          })
        );
      } else if (parsedMessage.type === TypesOfMsgsFromApplicantToServer.permission) {
        if (ws.role !== UserRole.Applicant) return;
        const payload = applicantToServerPermissionSchema.parse(parsedMessage.payload);
        const socket = userManager.getSocket(payload.donorId);
        socket?.send(
          JSON.stringify({
            type: parsedMessage.type,
            payload: {
              applicantId: ws.userId,
              status: payload.status,
              applicantPeerId: payload.applicantPeerId
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Event listener for when a client disconnects
  ws.on("close", () => {
    userManager.removeUser(ws.userId);
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
