import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.WEB_SOCKETS_BE_PORT as unknown as number;
export const AUTH_SECRET = process.env.AUTH_SECRET as string;
export const REDIS_MSG_QUEUE_KEY = (process.env.REDIS_MSG_QUEUE_KEY as string) || "zakaat";
