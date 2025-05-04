import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.WEB_RTC_SIGNALLING_BE_PORT_MINE as unknown as number;
export const NODE_ENV = (process.env.NODE_ENV as string) || "development";
