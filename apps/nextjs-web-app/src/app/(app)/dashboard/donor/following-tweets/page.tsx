import React from "react";
import { FetchFollowingTweets } from "@/actions/tweet.action";
import { InfiniteFollowingTweetsScrollFeed } from "./_components/infinite-following-tweets-scroll-feed";
import { Tweet } from "../_components/tweet";

const DonorFollowingTweetsPage = async () => {
  const tweets = await FetchFollowingTweets({ page: 1 });
  // console.log(tweets);

  return (
    <div className="mb-5 flex flex-col gap-y-5 px-2 sm:px-4">
      {tweets.data?.map((tweet) => (
        <Tweet
          key={tweet.id}
          name={tweet.author.name ?? ""}
          email={tweet.author.email ?? ""}
          time={tweet.createdAt}
          content={tweet.text}
          dp={tweet.author.image ?? ""}
        />
      ))}
      <InfiniteFollowingTweetsScrollFeed />
    </div>
  );
};

export default DonorFollowingTweetsPage;
