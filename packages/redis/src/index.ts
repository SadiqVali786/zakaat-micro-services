import { createClient, type RedisClientType } from "redis";
import { REDIS_URL } from "./env";

const redisPublisher: RedisClientType = createClient({
  url: REDIS_URL,
});
const redisSubscriber: RedisClientType = createClient({
  url: REDIS_URL,
});
const redisQueue: RedisClientType = createClient({
  url: REDIS_URL,
});
const redisCache: RedisClientType = createClient({
  url: REDIS_URL,
});
redisPublisher.on("error", (err) =>
  console.log(`redis-publisher client Error`, err)
);
redisSubscriber.on("error", (err) =>
  console.log(`redis-subscriber client Error`, err)
);
redisQueue.on("error", (err) => console.log(`redis-queue client Error`, err));
redisCache.on("error", (err) => console.log(`redis-cache client Error`, err));

(async () => {
  try {
    await Promise.all([
      redisPublisher.connect(),
      redisSubscriber.connect(),
      redisQueue.connect(),
      redisCache.connect(),
    ]);
    console.log("All Redis Clients Connected Successfully");
  } catch (err) {
    console.error("Redis Connection Failed:", err);
  }
})();

export { redisPublisher, redisSubscriber, redisQueue, redisCache };
