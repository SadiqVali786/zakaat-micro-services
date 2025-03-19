import dotenv from "dotenv";
dotenv.config();

export const RESEND_API_KEY = process.env.RESEND_API_KEY as unknown as string;
