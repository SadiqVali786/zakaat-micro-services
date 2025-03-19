/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { TWEETS_PER_PAGE } from "@/config/app.config";
import APP_PATHS from "@/config/path.config";
import prisma from "@/db";
import { ErrorHandler, standardizedApiError } from "@/lib/api-error-success-handlers/error";
import { SuccessResponse } from "@/lib/api-error-success-handlers/success";
import { idSchema } from "@/lib/validators/global";
import { searchTermSchema } from "@/lib/validators/search.validators";
import { createTweetSchema } from "@/lib/validators/tweet.validators";
import { ROLE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// PUBLIC
export const fetchTweetsAction = async (previousState: any, payload: z.infer<typeof idSchema>) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const tweets = await prisma.tweet.findMany({
      select: {
        id: true,
        text: true,
        Donor: {
          select: {
            fullname: true,
            selfie: true
          }
        },
        createdAt: true
      },
      skip: 1,
      take: TWEETS_PER_PAGE,
      cursor: { id: payload.id },
      orderBy: { createdAt: "desc" }
    });
    return new SuccessResponse("new tweet created", 201, tweets).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

// DONOR
export const createTweetAction = async (
  previousState: any,
  payload: z.infer<typeof createTweetSchema>
) => {
  try {
    payload = createTweetSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const tweet = await prisma.tweet.create({
      data: { ...payload, authorId: session.user.id }
    });
    revalidatePath(APP_PATHS.TWEETS);
    return new SuccessResponse("new tweet created", 201).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const fetchFollowingTweetsAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const followingTweets = await prisma.tweet.findMany({
      where: {
        Donor: {
          followers: {
            some: { from: session.user.id }
          }
        }
      },
      select: {
        id: true,
        text: true,
        Donor: {
          select: {
            fullname: true,
            selfie: true
          }
        },
        createdAt: true
      },
      skip: 1,
      take: TWEETS_PER_PAGE,
      cursor: { id: payload.id },
      orderBy: { createdAt: "desc" }
    });
    return new SuccessResponse("new tweets fetched", 201, followingTweets).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};
