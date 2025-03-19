"use client";

import { fetchFollowingTweetsAction } from "@/actions/tweet.actions";
import { TWEETS_PER_PAGE } from "@/config/app.config";
import { useActionState, useEffect, useState } from "react";
import Tweet from "./Tweet";
import DP from "@/../public/dashboard/dp.png";
import { TweetTypes } from "@/types/tweet.types";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";

type Props = { id?: string };

const FollowingTweetsScrollFeed: React.FC<Props> = ({ id }) => {
  const [actionState, action, isPending] = useActionState(fetchFollowingTweetsAction, null);

  const [followingTweets, setFollowingTweets] = useState<TweetTypes[] | []>([]);
  const [cursor, setCursor] = useState<string | undefined>(id);
  useEffect(() => {
    if (actionState && actionState.additional.length && isPending == false) {
      const additional = actionState.additional as TweetTypes[];
      const length = additional.length;
      if (length === TWEETS_PER_PAGE) setCursor(additional[length - 1].id);
      else setCursor(undefined);
      setFollowingTweets((prev) => [...prev, ...additional]);
    }
  }, [actionState, isPending]);

  useInfiniteScroll({ action, cursor, isPending });

  return (
    <div>
      {followingTweets.map((followingTweet) => (
        <Tweet
          key={followingTweet.id}
          dp={DP}
          fullName={followingTweet.Donor.fullname}
          time={followingTweet.createdAt}
          applicationLink="https://www.zakaat.com/zakaat-application/bismilla"
          tweetBody={followingTweet.text}
        />
      ))}
    </div>
  );
};

export default FollowingTweetsScrollFeed;
