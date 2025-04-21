import { redisPublisher, redisQueue } from "@repo/redis";
import { NODE_ENV, REDIS_MSG_QUEUE_KEY } from "./env";
import {
  type WorkerMessages,
  UserActivity,
  UserStatus,
  DifferentMessageStatus,
} from "@repo/common/types";
import {
  ChatMessageSchema,
  ChatMessageReceivedSchema,
  ChatMessageSeenSchema,
  UserOfflineSchema,
  UserOnlineSchema,
  UserOnboardingSchema,
} from "@repo/common/validators";
import { Logger } from "@repo/common/logger";
import { prisma } from "@repo/mongodb";
import { MessageStatus } from "@repo/mongodb";
import { DEVELOPMENT } from "@repo/common/constants";
import { sendOnboardingEmail } from "@repo/notifications";

let message: {
  key: string;
  element: string;
} | null;
const logger = new Logger();

const messageHandler = async (data: WorkerMessages) => {
  if (NODE_ENV === DEVELOPMENT) {
    logger.info("POPPED message: ", data);
  }
  try {
    if (data.type === UserActivity.Chatting) {
      const chatMessage = ChatMessageSchema.parse(data);
      const response = await prisma.message.create({
        data: {
          content: chatMessage.payload.content,
          senderId: chatMessage.payload.senderId,
          roomId: chatMessage.payload.roomId,
          sentAt: new Date(),
        },
      });
      await prisma.user.update({
        where: { id: chatMessage.payload.senderId },
        data: { lastSeen: new Date() },
      });
      redisPublisher.publish(
        chatMessage.payload.roomId,
        JSON.stringify({
          type: chatMessage.type,
          payload: {
            ...chatMessage.payload,
            messageId: response.id,
            sentAt: response.sentAt,
          },
        })
      );
      logger.info("Published message to the redis Pub-Sub");
    } else if (data.type === DifferentMessageStatus.Received) {
      const chatMessageReceived = ChatMessageReceivedSchema.parse(data);
      await prisma.message.update({
        where: { id: chatMessageReceived.payload.messageId },
        data: {
          status: chatMessageReceived.type as unknown as MessageStatus,
        },
      });
      await prisma.user.update({
        where: { id: chatMessageReceived.payload.senderId },
        data: { lastSeen: new Date() },
      });
      if (NODE_ENV === DEVELOPMENT) {
        logger.info("Updated message status in the DB");
      }
    } else if (data.type === DifferentMessageStatus.Seen) {
      const chatMessageSeen = ChatMessageSeenSchema.parse(data);
      await prisma.message.updateMany({
        where: {
          roomId: chatMessageSeen.payload.roomId,
          senderId: chatMessageSeen.payload.senderId,
          status: { not: MessageStatus.SEEN },
        },
        data: { status: MessageStatus.SEEN },
      });
      redisPublisher.publish(
        chatMessageSeen.payload.roomId,
        JSON.stringify({
          type: chatMessageSeen.type,
          payload: chatMessageSeen.payload,
        })
      );
      if (NODE_ENV === DEVELOPMENT) {
        logger.info("Updated message status in the DB");
      }
    } else if (data.type === UserStatus.Offline) {
      const userOffline = UserOfflineSchema.parse(data);
      await prisma.user.update({
        where: { id: userOffline.payload.userId },
        data: { lastSeen: new Date(), isOnline: false },
      });
      if (NODE_ENV === DEVELOPMENT) {
        logger.info("Updated user last seen in the DB");
      }
    } else if (data.type === UserStatus.Online) {
      const userOnline = UserOnlineSchema.parse(data);
      await prisma.user.update({
        where: { id: userOnline.payload.userId },
        data: { lastSeen: new Date(), isOnline: true },
      });
      if (NODE_ENV === DEVELOPMENT) {
        logger.info("Updated user last seen in the DB");
      }
    } else if (data.type === UserActivity.OnboardingEmail) {
      logger.info("POPPED message: ", data);
      const userOnboarding = UserOnboardingSchema.parse(data);
      const res = await sendOnboardingEmail(
        userOnboarding.payload.donorEmail,
        userOnboarding.payload.donorName
      );
      logger.info("Sent onboarding email", res);
      if (NODE_ENV === DEVELOPMENT) {
        logger.info("Sent onboarding email");
      }
    }
  } catch (error) {
    logger.error("Error while handling msgs in the worker", error);
  }
};

const processMessages = async () => {
  while (true) {
    try {
      message = await redisQueue.brPop(REDIS_MSG_QUEUE_KEY, 0);
      if (message) {
        const data: WorkerMessages = JSON.parse(message.element);
        await messageHandler(data);
      }
    } catch (error) {
      if (NODE_ENV === DEVELOPMENT) {
        logger.error("Error storing the message to DB", error);
      }
      if (message?.element) {
        await redisQueue.lPush(REDIS_MSG_QUEUE_KEY, JSON.stringify(message));
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retry
    }
  }
};

// Graceful shutdown handler
const shutdown = () => {
  logger.info("Shutting down message processor...");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

processMessages();
