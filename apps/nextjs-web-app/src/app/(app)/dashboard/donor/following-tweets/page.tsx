import React from "react";
import { FetchFollowingTweets } from "@/actions/tweet.action";
import { InfiniteFollowingTweetsScrollFeed } from "./_components/infinite-following-tweets-scroll-feed";
import { Tweet } from "../_components/tweet";
import { redirect } from "next/navigation";
import { APP_PATHS } from "@/config/path.config";
import { UserRole } from "@repo/common/types";
import { auth } from "@/auth";

const DonorFollowingTweetsPage = async () => {
  const session = await auth();
  if (session?.user.role !== UserRole.Donor) {
    if (session?.user.role === UserRole.Applicant) {
      redirect(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
    } else if (session?.user.role === UserRole.Verifier) {
      redirect(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
    } else {
      redirect(APP_PATHS.HOME);
    }
  }

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
