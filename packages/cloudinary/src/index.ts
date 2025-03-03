import { v2 as cloudinary } from "cloudinary";
import { cloudinary_secretes } from "./env.js";

cloudinary.config({
  cloud_name: cloudinary_secretes.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: cloudinary_secretes.CLOUDINARY_API_KEY,
  api_secret: cloudinary_secretes.CLOUDINARY_API_SECRET
});

export { cloudinary };
