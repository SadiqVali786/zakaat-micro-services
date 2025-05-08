"use client";

import { cn } from "@/lib/utils";
import { CldVideoPlayer, CldVideoPlayerProps } from "next-cloudinary";

export const CloudinaryVideo = (props: CldVideoPlayerProps) => {
  return (
    <div className={cn("relative", `w-[${props.width}px] h-[${props.height}px]`)}>
      <CldVideoPlayer {...props} />
    </div>
  );
};
// id, width, height, alt, src
