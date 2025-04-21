import { cloudinary } from "./cloudinary";

export const uploadFile = async (file: File) => {
  const base64Image = await file
    .arrayBuffer()
    .then((buffer) => Buffer.from(buffer).toString("base64"));
  const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64Image}`, {
    resource_type: "auto",
    folder: "zakaat/applicants/selfies"
  });
  return result;
};
