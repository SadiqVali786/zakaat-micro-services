import { createClient, RedisClientType } from "redis";

const redisPublisher: RedisClientType = createClient();
const redisSubscriber: RedisClientType = createClient();
const redisQueue: RedisClientType = createClient();
const redisCache: RedisClientType = createClient();

redisPublisher.on("error", (err) => console.log(`redis-publisher client Error`, err));
redisSubscriber.on("error", (err) => console.log(`redis-subscriber client Error`, err));
redisQueue.on("error", (err) => console.log(`redis-queue client Error`, err));
redisCache.on("error", (err) => console.log(`redis-cache client Error`, err));

(async () => {
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
})();

export { redisPublisher, redisSubscriber, redisQueue, redisCache };
