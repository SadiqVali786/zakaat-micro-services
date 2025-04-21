import dotenv from "dotenv";
import path from "path";

// Load .env file from the packages/common directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const AUTH_SECRET = process.env.AUTH_SECRET as string;
