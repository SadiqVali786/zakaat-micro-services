import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.RAZORPAY_PAYMENTS_BE_PORT as unknown as number;
