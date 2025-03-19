import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.WEB_RTC_SIGNALLING_BE_PORT as unknown as number;
export const AUTH_SECRET = process.env.AUTH_SECRET as string;
