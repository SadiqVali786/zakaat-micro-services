"use server";

import { TWEETS_PER_PAGE } from "@/config/server-actions.config";
import { prisma } from "@repo/mongodb";
import { createSafeAction } from "safe-actions-state";
import { z } from "zod";
import { UserRole } from "@repo/mongodb";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ############################################
// ########## DONOR SPECIFIC ACTIONS ##########
// ############################################
// Fetch All Tweets given page
const FetchTweetsSchema = z.object({
  page: z.number().optional()
});

export const FetchTweets = async (args?: z.infer<typeof FetchTweetsSchema>) => {
  const tweets = await prisma.tweet.findMany({
    include: { author: true },
    skip: (args!.page! - 1) * TWEETS_PER_PAGE,
    take: TWEETS_PER_PAGE,
    orderBy: { createdAt: "desc" }
  });
  return tweets.length ? { data: tweets } : { error: "No tweets found" };
};

export const SafeFetchTweets = createSafeAction(
  FetchTweets,
  FetchTweetsSchema,
  [UserRole.DONOR],
  true
);

// Create Tweet given text
export const CreateTweet = async (text: string) => {
  const session = await auth();
  if (!session?.user) return null;
  const tweet = await prisma.tweet.create({
    data: {
      text,
      authorId: session.user.id
    }
  });
  revalidatePath("/dashboard/donor/tweets");
  return tweet;
};

// Fetch Following Tweets given page
export const FetchFollowingTweets = async (args?: z.infer<typeof FetchFollowingTweetsSchema>) => {
  const session = await auth();
  const tweets = await prisma.tweet.findMany({
    where: { author: { followers: { some: { from: session?.user.id } } } },
    include: { author: true },
    skip: (args!.page! - 1) * TWEETS_PER_PAGE,
    take: TWEETS_PER_PAGE,
    orderBy: { createdAt: "desc" }
  });
  return tweets.length ? { data: tweets } : { error: "No tweets found" };
};

const FetchFollowingTweetsSchema = z.object({
  page: z.number().optional()
});

export const SafeFetchFollowingTweets = createSafeAction(
  FetchFollowingTweets,
  FetchFollowingTweetsSchema,
  [UserRole.DONOR],
  true
);
