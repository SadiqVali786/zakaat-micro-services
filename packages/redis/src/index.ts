import { createClient, type RedisClientType } from "redis";
import { REDIS_URL } from "./env";

console.log("##############################################################");
console.log("REDIS_URL", REDIS_URL);
console.log("##############################################################");

const redisConfig = {
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        return new Error("Max retries reached");
      }
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 10000, // 10 seconds
    keepAlive: 10000 // 10 seconds
  }
};

const redisPublisher: RedisClientType = createClient(redisConfig);
const redisSubscriber: RedisClientType = createClient(redisConfig);
const redisQueue: RedisClientType = createClient(redisConfig);
const redisCache: RedisClientType = createClient(redisConfig);
redisPublisher.on("error", (err) => console.log(`redis-publisher client Error`, err));
redisSubscriber.on("error", (err) => console.log(`redis-subscriber client Error`, err));
redisQueue.on("error", (err) => console.log(`redis-queue client Error`, err));
redisCache.on("error", (err) => console.log(`redis-cache client Error`, err));

const connectRedis = async () => {
  try {
    await Promise.all([
      redisPublisher.connect(),
      redisSubscriber.connect(),
      redisQueue.connect(),
      redisCache.connect()
    ]);
    console.log("All Redis Clients Connected Successfully");
  } catch (err) {
    console.error("Redis Connection Failed:", err);
  }
};

connectRedis();

export { redisPublisher, redisSubscriber, redisQueue, redisCache };
