import { DEVELOPMENT } from "@repo/common/constants";
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.RAZORPAY_PAYMENTS_BE_PORT as unknown as number;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID as string;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET as string;
export const RAZORPAY_WEBHOOK_SECRET = process.env
  .RAZORPAY_WEBHOOK_SECRET as string;
export const NODE_ENV = DEVELOPMENT;
export const FRONTEND_URL = process.env.FRONTEND_URL as string;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS as string;
