"use server";

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadFile = async (file: File) => {
  const base64Image = await file
    .arrayBuffer()
    .then((buffer) => Buffer.from(buffer).toString("base64"));
  const result = await cloudinary.v2.uploader.upload(`data:${file.type};base64,${base64Image}`, {
    resource_type: "auto",
    folder: "zakaat/applicants/selfies"
  });
  return result;
};
