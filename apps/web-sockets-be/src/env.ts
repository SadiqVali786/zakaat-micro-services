import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.WEB_SOCKETS_BE_PORT as unknown as number;
export const REDIS_MSG_QUEUE_KEY = (process.env.REDIS_MSG_QUEUE_KEY as string) || "zakaat";
export const NODE_ENV = (process.env.NODE_ENV as string) || "development";
