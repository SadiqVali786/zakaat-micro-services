import DP from "@/../public/dashboard/dp.png";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import PageWrapper from "@/components/page-wrapper";
import Tweet from "@/components/Tweet";
import TweetInputArea from "@/components/TweetInputArea";
import TweetsScrollFeed from "@/components/tweets-scroll-feed";

import { TWEETS_PER_PAGE } from "@/config/app.config";
import { prisma } from "@repo/mongodb";

export default async function Home() {
  const tweets = await prisma.tweet.findMany({
    select: {
      id: true,
      text: true,
      Donor: {
        select: {
          name: true,
          selfie: true
        }
      },
      createdAt: true
    },
    take: TWEETS_PER_PAGE,
    orderBy: { createdAt: "desc" }
  });

  return (
    <PageWrapper>
      <div className="flex flex-col">
        <InfiniteFeedbar type="tweets" />
        <TweetInputArea />
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            dp={DP}
            name={tweet.Donor.name as string}
            time={tweet.createdAt}
            applicationLink="https://www.zakaat.com/zakaat-application/bismilla"
            tweetBody={tweet.text}
          />
        ))}
        {tweets.length === TWEETS_PER_PAGE && (
          <TweetsScrollFeed id={tweets[tweets.length - 1]!.id} />
        )}
      </div>
    </PageWrapper>
  );
}
