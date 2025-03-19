"use client";

import APP_PATHS from "@/config/path.config";
import { ICONS } from "@/lib/media-imports/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FeedbarType = {
  type: "applications" | "tweets" | "path" | "empty";
};

export default function InfiniteFeedbar({ type }: FeedbarType) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "border-neutral-11 xs:pt-8 sticky top-0 flex h-[72px] border-b-[1px] pt-4 backdrop-blur-3xl",
        { "items-center gap-x-2 pb-4 pl-4": type === "path" },
        { "": type === "empty" }
      )}
    >
      {type === "applications" ? (
        <>
          <p className="border-brand-blue w-[33.33%] grow cursor-pointer border-b-[1px] py-[10px] text-center leading-tight text-blue-50">
            Nearest
          </p>
          <p className="text-neutral-7 w-[33.33%] grow cursor-not-allowed py-[10px] text-center leading-tight">
            Rating -- High to Low
          </p>
          <p className="text-neutral-7 w-[33.33%] grow cursor-not-allowed py-[10px] text-center leading-tight">
            Newest
          </p>
        </>
      ) : type === "tweets" ? (
        <>
          <Link
            href={APP_PATHS.TWEETS}
            className={cn(
              "w-[50%] grow py-[10px] text-center leading-tight text-blue-50",
              pathname.includes(APP_PATHS.TWEETS) ? "border-brand-blue border-b-[1px]" : ""
            )}
          >
            Tweets
          </Link>
          <Link
            href={APP_PATHS.FOLLOWING_TWEETS}
            className={cn(
              "w-[50%] grow py-[10px] text-center leading-tight text-blue-50",
              pathname.includes(APP_PATHS.FOLLOWING_TWEETS)
                ? "border-brand-blue border-b-[1px]"
                : ""
            )}
          >
            Following Tweets
          </Link>
        </>
      ) : type === "path" ? (
        <>
          <Image alt="back" src={ICONS["arrow-backward-black"]} className="cursor-pointer" />
          <span>{pathname.split("/")[length - 1]}</span>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
