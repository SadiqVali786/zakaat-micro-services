/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { ErrorHandler, standardizedApiError } from "@/lib/api-error-success-handlers/error";
import { SuccessResponse } from "@/lib/api-error-success-handlers/success";
import cloudinary from "@/lib/cloudinary";
import { signupFormSchema } from "@/lib/validators/auth.validator";
import { ROLE } from "@prisma/client";
import { z } from "zod";

// TODO: Change name of the action to welcome action
export const signupAction = async (
  previousState: any,
  payload: z.infer<typeof signupFormSchema>
) => {
  try {
    payload = signupFormSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || !session.user.email)
      throw new ErrorHandler("You must be authenticated to access this resource.", "UNAUTHORIZED");
    // #########################################################
    const base64Image = await payload.selfie
      .arrayBuffer()
      .then((buffer) => Buffer.from(buffer).toString("base64"));
    const response = await cloudinary.uploader.upload(
      `data:${payload.selfie.type};base64,${base64Image}`,
      { folder: "zakaat/applicants" }
    );
    const newUser = await prisma.user.create({
      data: {
        fullname: payload.fullname as string,
        phoneNum: payload.phoneNum as string,
        role: payload.role as ROLE,
        selfie: response.secure_url,
        email: session?.user.email as string,
        location: {
          type: "Point",
          coordinates: [
            payload.longitude as unknown as number,
            payload.latitude as unknown as number
          ]
        }
      }
    });
    return new SuccessResponse("User Registration Successfull", 201).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};
