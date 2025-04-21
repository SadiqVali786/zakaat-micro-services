import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import AppStore from "@/../public/landing-page/hero/app-store.png";
import GooglePlay from "@/../public/landing-page/hero/google-play.png";
import { cn } from "@/lib/utils";

export const Pill = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={cn("rounded-lg bg-gradient-to-r from-[#4135F3] to-[#BE52F2] p-[1]", className)}>
      <p className="bg-brand-dark rounded-lg px-5 py-2 text-sm leading-tight text-blue-100">
        {text}
      </p>
    </div>
  );
};

type HeadingProps = {
  headingPart1: string;
  headingPart2: string;
  className?: string;
};

export const Heading = ({ headingPart1, headingPart2, className }: HeadingProps) => {
  return (
    <h1 className={cn("leading-none font-bold", className)}>
      <span className="text-blue-200">{headingPart1}</span>
      <span className="text-purple-200">{headingPart2}</span>
    </h1>
  );
};

type InfoLineProps = {
  text: string;
  className?: string;
};

export const InfoLine = ({ text, className }: InfoLineProps) => {
  return (
    <p className={cn("text-16-to-20-with-768-to-1440 text-xl text-blue-100", className)}>{text}</p>
  );
};

type SectionTemplateProps = {
  pillText: string;
  headingPart1: string;
  headingPart2: string;
  infoLine: string;
  className?: string;
  headingFontClamp: string;
  sectionImage: StaticImageData;
  hideApps?: boolean;
};

export const SectionTemplate = ({
  pillText,
  headingPart1,
  headingPart2,
  infoLine,
  className,
  headingFontClamp,
  sectionImage,
  hideApps = false
}: SectionTemplateProps) => {
  return (
    <section
      className={cn(
        "px-8-to-40-with-375-to-768 md:pl-40-to-80-with-768-to-1440 lg:px-40-to-80-with-768-to-1440 gap-x-0-to-36-with-768-to-1440 flex w-full flex-col items-center justify-between gap-y-11 md:flex-row md:pr-0",
        className
      )}
      style={{ columnGap: "clamp(0rem, -2.571rem + 5.36vw, 2.25rem)" }}
    >
      <div
        className="flex flex-col"
        style={{ rowGap: "clamp(3.75rem, 1.607rem + 4.46vw, 5.625rem)" }}
      >
        <div
          className="flex flex-col"
          style={{ rowGap: "clamp(1.875rem, 0.804rem + 2.23vw, 2.813rem)" }}
        >
          <Pill text={pillText} className="mx-auto text-center" />
          <Heading
            headingPart1={headingPart1}
            headingPart2={headingPart2}
            className={headingFontClamp}
          />
          <InfoLine text={infoLine} />
        </div>
        <div
          className={cn("flex items-center justify-center", hideApps && "flex md:hidden lg:flex")}
          style={{ columnGap: "clamp(1.25rem, 1.03rem + 0.94vw, 1.875rem)" }}
        >
          <Link href={"#"}>
            <Image
              src={AppStore}
              alt="App Store"
              className="object-cover"
              style={{ width: "clamp(7.997rem, 4.28rem + 7.74vw, 11.25rem)" }}
            />
          </Link>
          <Link href={"#"}>
            <Image
              src={GooglePlay}
              alt="google-play"
              className="object-cover"
              style={{ width: "clamp(7.997rem, 4.28rem + 7.74vw, 11.25rem)" }}
            />
          </Link>
        </div>
      </div>
      <Image
        alt="hero-iPhone"
        src={sectionImage}
        className="h-auto w-[16.09rem] object-cover"
        style={{ minWidth: "clamp(16.09rem, 8.05rem + 16.75vw, 23.125rem)" }}
      />
    </section>
  );
};
