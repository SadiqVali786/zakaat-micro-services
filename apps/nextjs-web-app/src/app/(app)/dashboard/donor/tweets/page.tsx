import { FetchTweets } from "@/actions/tweet.action";
import { InfiniteTweetsScrollFeed } from "./_components/infinite-tweets-scroll-feed";
import TweetForm from "./_components/tweet-form";
import { Tweet } from "../_components/tweet";
import { auth } from "@/auth";
import { UserRole } from "@repo/common/types";
import { APP_PATHS } from "@/config/path.config";
import { redirect } from "next/navigation";

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

  const tweets = await FetchTweets({ page: 1 });
  // console.log(tweets);

  return (
    <div className="mb-5 flex flex-col gap-y-5">
      <TweetForm />
      <div className="flex flex-col gap-y-5 px-2 sm:px-4">
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
        <InfiniteTweetsScrollFeed />
      </div>
    </div>
  );
};

export default DonorFollowingTweetsPage;
