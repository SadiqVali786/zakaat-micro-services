import dotenv from "dotenv";
dotenv.config();

export const REDIS_MSG_QUEUE_KEY = process.env.REDIS_MSG_QUEUE_KEY as string;
export const NODE_ENV = (process.env.NODE_ENV as string) || "development";
