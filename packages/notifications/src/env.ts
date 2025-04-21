import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
