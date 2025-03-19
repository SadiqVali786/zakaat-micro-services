import dotenv from "dotenv";
dotenv.config({ path: "/home/sadiq/Desktop/do-or-die-two/apps/razorpay-payments-be/.env" });

export const PORT = process.env.RAZORPAY_PAYMENTS_BE_PORT as unknown as number;
