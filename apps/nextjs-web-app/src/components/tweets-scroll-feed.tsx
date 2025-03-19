"use client";

import { fetchTweetsAction } from "@/actions/tweet.actions";
import { useActionState, useEffect, useState } from "react";
import Tweet from "./Tweet";
import { TWEETS_PER_PAGE } from "@/config/app.config";
import DP from "@/../public/dashboard/dp.png";
import { TweetTypes } from "@/types/tweet.types";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";

type Props = { id?: string };

const TweetsScrollFeed: React.FC<Props> = ({ id }) => {
  const [actionState, action, isPending] = useActionState(fetchTweetsAction, null);

  const [tweets, setTweets] = useState<TweetTypes[] | []>([]);
  const [cursor, setCursor] = useState<string | undefined>(id);
  useEffect(() => {
    if (actionState && actionState.additional.length && isPending == false) {
      const additional = actionState.additional as TweetTypes[];
      const length = additional.length;
      if (length === TWEETS_PER_PAGE) setCursor(additional[length - 1].id);
      else setCursor(undefined);
      setTweets((prev) => [...prev, ...additional]);
    }
  }, [actionState, isPending]);

  useInfiniteScroll({ action, cursor, isPending });

  return (
    <div>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          dp={DP}
          fullName={tweet.Donor.fullname}
          time={tweet.createdAt}
          applicationLink="https://www.zakaat.com/zakaat-application/bismilla"
          tweetBody={tweet.text}
        />
      ))}
    </div>
  );
};

export default TweetsScrollFeed;
