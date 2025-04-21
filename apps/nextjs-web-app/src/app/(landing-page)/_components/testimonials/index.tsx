/* eslint-disable @next/next/no-img-element */
import { Marquee } from "@/components/magicui/marquee";
import { Heading } from "../global";
import { Pill } from "../global";

const reviews = [
  {
    fullname: "Fatima Khan",
    body: "This platform has redefined how Zakat is distributed. Knowing that local activists verify every application gives me so much confidence. I’ve been able to help people in my community directly—such a fulfilling experience!",
    img: "https://avatar.vercel.sh/fatima"
  },
  {
    fullname: "Ahmed Sheikh",
    body: "The transparency on this platform is unmatched. I could see verified applications from people in my neighborhood and felt reassured that my Zakat was going to those who truly needed it. Highly recommend!",
    img: "https://avatar.vercel.sh/sheikh"
  },
  {
    fullname: "Sarah Iqbal",
    body: "I was hesitant at first, but the level of detail and local verification this platform provides is incredible. It made me feel like my donations were more than just a transaction—they were an act of trust and compassion.",
    img: "https://avatar.vercel.sh/sarah"
  },
  {
    fullname: "Imran Malik",
    body: "As a donor, I always worried about where my Zakat was going. This platform removes all doubts by connecting me with deserving individuals verified by people I trust in my locality. A game-changer for the community!",
    img: "https://avatar.vercel.sh/imran"
  },
  {
    fullname: "Ayesha Siddiqui",
    body: "The anonymity option is perfect for people who want to preserve their dignity while seeking Zakat. I’m amazed at how this platform balances privacy and trust so seamlessly!",
    img: "https://avatar.vercel.sh/ayesha"
  },
  {
    fullname: "Zain Ali",
    body: "What I love about this platform is how they recommend nearby applicants. Seeing verified Zakat seekers from my area makes it easier to donate, knowing I’m supporting my local community.",
    img: "https://avatar.vercel.sh/zain"
  }
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, fullname, body }: { img: string; fullname: string; body: string }) => {
  return (
    <figure className="flex w-[439px] flex-col items-start rounded-2xl border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#211f30] p-6">
      <div className="flex items-center gap-3">
        <img className="rounded-full" width="60" height="60" alt="avatar" src={img} />
        <div className="flex flex-col items-start justify-center">
          <figcaption className="text-base leading-tight text-[#a5a2e8]">{fullname}</figcaption>
          <p className="text-base leading-tight text-[#817eb5]">
            @{fullname.toLowerCase().replace(" ", "_")}
          </p>
        </div>
      </div>
      <blockquote className="mt-4 text-base leading-tight text-[#64628c]">{body}</blockquote>
    </figure>
  );
};

function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-y-11 overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.fullname} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.fullname} {...review} />
        ))}
      </Marquee>
      <div className="dark:from-brand-dark pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r" />
      <div className="dark:from-brand-dark pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l" />
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <div className="mt-180-to-250-with-768-to-1440 gap-y-60-to-90-with-768-to-1440 flex flex-col items-center">
      <div className="px-8-to-40-with-375-to-768 md:px-40-to-80-with-768-to-1440 flex flex-col gap-y-11">
        <Pill text="✨ Testimonials" className="mx-0 text-center sm:mx-auto" />
        <Heading
          headingPart1={"Join thousands who trust us for secure, dignified, and "}
          headingPart2={"impactful Zakaat Donations"}
          className="text-35-to-55-with-768-to-1440 sm:text-center"
        />
      </div>
      <MarqueeDemo />
    </div>
  );
}
