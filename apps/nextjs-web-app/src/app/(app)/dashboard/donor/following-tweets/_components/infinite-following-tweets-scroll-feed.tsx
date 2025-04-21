"use client";

import { FetchFollowingTweets } from "@/actions/tweet.action";
import { Tweet, User } from "@repo/mongodb";
import { useEffect, useState } from "react";
import { useSafeAction } from "safe-actions-state";
import { Tweet as TweetComponent } from "../../_components/tweet";

type TweetWithAuthorType = Tweet & {
  author: User;
};

export const InfiniteFollowingTweetsScrollFeed = () => {
  const [tweets, setTweets] = useState<TweetWithAuthorType[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const { clientAction, isPending, fieldErrors, setFieldErrors, error, data, abortAction } =
    useSafeAction(FetchFollowingTweets, {
      toastMessages: {
        loading: "Fetching tweets...",
        success: "Tweets fetched successfully"
      },
      onStart: () => console.log("STARTED"),
      onSuccess: (data) => {
        console.log("SUCCESS", data);
        if (data && data.length > 0) {
          setTweets((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        } else {
          setHasMore(false);
        }
      },
      onError: (error) => {
        setHasMore(false);
        console.log("ERROR", error);
      },
      onComplete: () => console.log("COMPLETE"),
      retries: 3
    });

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeout) return;
      timeout = setTimeout(async () => {
        if (
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
          hasMore &&
          !isPending
        ) {
          await clientAction({ page });
        }
        timeout = null;
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [page, hasMore, isPending, clientAction]);

  return (
    <div className="flex flex-col gap-y-5">
      {tweets.map((tweet) => (
        <TweetComponent
          key={tweet.id}
          name={tweet.author.name ?? ""}
          email={tweet.author.email ?? ""}
          time={tweet.createdAt}
          content={tweet.text}
          dp={tweet.author.image ?? ""}
        />
      ))}
    </div>
  );
};
