import { cn } from "@/lib/utils";
import Image from "next/image";

import Feature1 from "@/../public/icons/feature1.png";
import Feature2 from "@/../public/icons/feature2.png";
import Feature3 from "@/../public/icons/feature3.png";
import Feature4 from "@/../public/icons/feature4.png";
import Feature5 from "@/../public/icons/feature5.png";
import Feature6 from "@/../public/icons/feature6.png";
import Feature7 from "@/../public/icons/feature7.png";
import Feature8 from "@/../public/icons/feature8.png";
import { Heading } from "../global";
import { Pill } from "../global";

function FeaturesSectionDemo() {
  const features = [
    {
      title: "Screening with AI",
      description:
        "Initial automated screening using AI to filter applications and reduce potential misuse.",
      icon: <Image src={Feature1} alt="feature1" width={48} height={48} />
    },
    {
      title: "Verified & Curated Cases",
      description:
        "Access a list of high-need, genuine cases, each rigorously verified by our expert team through detailed checks.",
      icon: <Image src={Feature2} alt="feature2" width={48} height={48} />
    },
    {
      title: "Zakat for Friends & Relatives",
      description:
        "Easily give Zakat to friends or relatives. Search for their applications by phone number on our platform.",
      icon: <Image src={Feature3} alt="feature3" width={48} height={48} />
    },
    {
      title: "Refer Applicants to Donors",
      description:
        "Recommend genuine applicants by sharing their Application with your contacts on our platform.",
      icon: <Image src={Feature4} alt="feature4" width={48} height={48} />
    },
    {
      title: "Save Time & Less Effort",
      description:
        "Skip lengthy checks with fully vetted applications, allowing you to focus on impactful giving.",
      icon: <Image src={Feature5} alt="feature5" width={48} height={48} />
    },
    {
      title: "Feel secure in privacy",
      description:
        "If you prefer not to reveal your identity, your application remains hidden while still receiving Zakaat donations.",
      icon: <Image src={Feature6} alt="feature6" width={48} height={48} />
    },
    {
      title: "Audio/Video Calls & Chat",
      description:
        "Connect with applicants directly within the app. Contact details remain private unless applicants choose to share.",
      icon: <Image src={Feature7} alt="feature7" width={48} height={48} />
    },
    {
      title: "Global Transactions",
      description:
        "If you want to give zakaat to any certain person in other coutry you can with our platform.",
      icon: <Image src={Feature8} alt="feature8" width={48} height={48} />
    }
  ];

  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature dark:border-neutral-11 relative flex flex-col py-10 lg:border-r",
        (index === 0 || index === 4) && "dark:border-neutral-11 lg:border-l",
        index < 4 && "dark:border-neutral-11 lg:border-b"
      )}
    >
      {index < 4 && (
        <div className="dark:from-neutral-11 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 4 && (
        <div className="dark:from-neutral-11 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="relative z-10 mb-4 px-5 text-neutral-600 dark:text-neutral-400">{icon}</div>
      <div className="relative z-10 mb-2 px-5 text-lg font-bold">
        <div className="dark:bg-neutral-11 absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-50" />
        <span className="inline-block text-lg font-normal text-blue-100 transition duration-200 group-hover/feature:translate-x-2">
          {title}
        </span>
      </div>
      <p className="text-neutral-7 relative z-10 max-w-xs px-5 text-sm">{description}</p>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <div className="mt-180-to-250-with-768-to-1440 gap-y-60-to-90-with-768-to-1440 flex flex-col items-center">
      <div className="px-8-to-40-with-375-to-768 md:px-40-to-80-with-768-to-1440 flex flex-col gap-y-11">
        <Pill text="✨ Features of Zakaat Platform" className="mx-0 text-center sm:mx-auto" />
        <Heading
          headingPart1={"Streamlined tools, "}
          headingPart2={"making every Zakaat contribution secure"}
          className="text-35-to-55-with-768-to-1440 sm:text-center"
        />
      </div>
      <FeaturesSectionDemo />
    </div>
  );
}
