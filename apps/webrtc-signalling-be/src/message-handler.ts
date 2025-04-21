import { UserManager } from "./user-manager";
import { Logger } from "@repo/common/logger";
import {
  type ExtendedWebSocket,
  type WebRTCSignallingServerMessages,
  DifferentWebRTCSignallingServerMessages,
  UserRole,
} from "@repo/common/types";
import {
  BusyMessageSchema,
  ConsentMessageSchema,
  PermissionMessageSchema,
} from "@repo/common/validators";

export class MessageHandler {
  private userManager: UserManager = UserManager.getInstance();
  private logger: Logger = new Logger();
  private static instance: MessageHandler;

  private constructor() {}

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  public async handleMessage(
    socket: ExtendedWebSocket,
    rawMessage: string
  ): Promise<void> {
    try {
      const parsedMessage = JSON.parse(
        rawMessage
      ) as WebRTCSignallingServerMessages;
      this.logger.info(`Received message: ${rawMessage}`);
      switch (parsedMessage.type) {
        case DifferentWebRTCSignallingServerMessages.Consent:
          await this.handleConsentMessage(socket, parsedMessage);
          break;
        case DifferentWebRTCSignallingServerMessages.Permission:
          await this.handlePermissionMessage(socket, parsedMessage);
          break;
        case DifferentWebRTCSignallingServerMessages.Busy:
          await this.handleBusyMessage(socket, parsedMessage);
          break;
        default:
          this.logger.warn(`Unknown message type: ${parsedMessage}`);
      }
    } catch (error) {
      this.logger.error("Error handling message:", error);
      socket.send(
        JSON.stringify({
          type: DifferentWebRTCSignallingServerMessages.Error,
          payload: null,
        })
      );
    }
  }

  private async handleConsentMessage(
    socket: ExtendedWebSocket,
    message: unknown
  ): Promise<void> {
    if (socket.role !== UserRole.Donor) throw new Error("Donor role required");
    const parsedMessage = ConsentMessageSchema.parse(message);
    const targetSocket = this.userManager.getSocket(
      parsedMessage.payload.applicantId
    );
    if (targetSocket) {
      targetSocket.send(
        JSON.stringify({
          type: DifferentWebRTCSignallingServerMessages.Consent,
          payload: {
            donorId: socket.userId,
            donorName: socket.name,
            donorImage: socket.image,
          },
        })
      );
      this.logger.info(
        `Consent message sent to ${parsedMessage.payload.applicantId}`
      );
      return;
    }
    throw new Error("Target socket not found");
  }

  private async handlePermissionMessage(
    socket: ExtendedWebSocket,
    message: unknown
  ): Promise<void> {
    if (socket.role !== UserRole.Applicant)
      throw new Error("Applicant role required");
    const parsedMessage = PermissionMessageSchema.parse(message);
    const targetSocket = this.userManager.getSocket(
      parsedMessage.payload.donorId
    );
    if (targetSocket) {
      targetSocket.send(
        JSON.stringify({
          type: DifferentWebRTCSignallingServerMessages.Permission,
          payload: {
            applicantPeerId: parsedMessage.payload.applicantPeerId,
            donorId: socket.userId,
          },
        })
      );
      this.logger.info(
        `Permission message sent to ${parsedMessage.payload.donorId}`
      );
      return;
    }
    throw new Error("Target socket not found");
  }

  private async handleBusyMessage(
    socket: ExtendedWebSocket,
    message: unknown
  ): Promise<void> {
    if (socket.role !== UserRole.Applicant)
      throw new Error("Applicant role required");
    const parsedMessage = BusyMessageSchema.parse(message);
    const targetSocket = this.userManager.getSocket(
      parsedMessage.payload.donorId
    );
    if (targetSocket) {
      targetSocket.send(
        JSON.stringify({
          type: DifferentWebRTCSignallingServerMessages.Busy,
          payload: {
            donorId: socket.userId,
          },
        })
      );
      this.logger.info(`Busy message sent to ${parsedMessage.payload.donorId}`);
      return;
    }
    throw new Error("Target socket not found");
  }
}
