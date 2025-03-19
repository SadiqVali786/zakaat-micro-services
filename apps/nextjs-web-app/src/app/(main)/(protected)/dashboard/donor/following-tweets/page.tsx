import DP from "@/../public/dashboard/dp.png";
import { auth } from "@/auth";
import FollowingTweetsScrollFeed from "@/components/following-tweets-scroll-feed";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import PageWrapper from "@/components/page-wrapper";
import Tweet from "@/components/Tweet";
import TweetInputArea from "@/components/TweetInputArea";
import { TWEETS_PER_PAGE } from "@/config/app.config";
import { prisma } from "@repo/mongodb";

export default async function Home() {
  const session = await auth();

  const followingTweets = await prisma.tweet.findMany({
    where: {
      Donor: {
        followers: {
          some: { from: session?.user.id }
        }
      }
    },
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
        {followingTweets.map((followingTweet) => (
          <Tweet
            key={followingTweet.id}
            dp={DP}
            name={followingTweet.Donor.name as string}
            time={followingTweet.createdAt}
            applicationLink="https://www.zakaat.com/zakaat-application/bismilla"
            tweetBody={followingTweet.text}
          />
        ))}
        {followingTweets.length === TWEETS_PER_PAGE && (
          <FollowingTweetsScrollFeed id={followingTweets[followingTweets.length - 1]!.id} />
        )}
      </div>
    </PageWrapper>
  );
}
