import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const REDIS_URL = process.env.REDIS_URL as string;
