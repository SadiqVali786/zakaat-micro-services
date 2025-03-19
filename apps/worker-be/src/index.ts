 
import { redisPublisher, redisQueue } from "@repo/redis";
import { REDIS_MSG_QUEUE_KEY } from "./env";
import { MsgQueueToWorkerMsgsSchema } from "@repo/common/types";
import {
  ChatMessagePayloadSchema,
  ChatMessageStatusPayloadSchema,
  TypesOfMsgsFromMsgQueueToWorker,
  UserOfflinePayloadSchema
} from "@repo/common/validators";

let message: {
  key: string;
  element: string;
} | null;

const messageHandler = async (data: MsgQueueToWorkerMsgsSchema) => {
  console.log("POPPED message: ", data);
  const result = await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating DB call delay
  // TODO: Publish the result from last line to the redis Pub-Sub
  try {
    if (data.type === TypesOfMsgsFromMsgQueueToWorker.Chating) {
      const payload = ChatMessagePayloadSchema.parse(data.payload);
      redisPublisher.publish(
        data.payload.roomId.toString(),
        JSON.stringify({ type: data.type, payload: { ...payload, messageId: 123 } })
      );
    } else if (data.type === TypesOfMsgsFromMsgQueueToWorker.MessageRecieved) {
      const payload = ChatMessageStatusPayloadSchema.parse(data.payload);
      redisPublisher.publish(
        data.payload.roomId.toString(),
        JSON.stringify({
          type: data.type,
          payload: { ...payload }
        })
      );
    } else if (data.type === TypesOfMsgsFromMsgQueueToWorker.MessageSeen) {
      const payload = ChatMessageStatusPayloadSchema.parse(data.payload);
      redisPublisher.publish(
        data.payload.roomId.toString(),
        JSON.stringify({
          type: data.type,
          payload: { ...payload }
        })
      );
    } else if (data.type === TypesOfMsgsFromMsgQueueToWorker.Offline) {
      const payload = UserOfflinePayloadSchema.parse(data.payload);
      // DB call to save last seen
    }
    // else if (data.type === TypesOfMsgsFromMsgQueueToWorker.Email) {}
  } catch (error) {
    console.log("Error while handling msgs in the worker", error);
  }
};

const processMessages = async () => {
  while (true) {
    try {
      message = await redisQueue.brPop(REDIS_MSG_QUEUE_KEY, 0);
      if (message) {
        const data: MsgQueueToWorkerMsgsSchema = JSON.parse(message.element);
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
