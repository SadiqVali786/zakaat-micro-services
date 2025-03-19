/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisQueue } from "@repo/redis";
import { REDIS_MSG_QUEUE_KEY } from "./env";

let message: {
  key: string;
  element: string;
} | null;

const messageHandler = async (data: any) => {
  console.log("POPPED message: ", data);
};

const processMessages = async () => {
  while (true) {
    try {
      message = await redisQueue.brPop(REDIS_MSG_QUEUE_KEY, 0);
      if (message) {
        const data: any = JSON.parse(message.element);
        await messageHandler(data);
      }
    } catch (error) {
      console.error("Error storing the message to DB", error);
      if (message?.element) {
        await redisQueue.lPush(REDIS_MSG_QUEUE_KEY, JSON.stringify(message));
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retry
    }
  }
};

// Graceful shutdown handler
const shutdown = () => {
  console.log("Shutting down message processor...");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

processMessages();
