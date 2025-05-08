"use client";

import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";

export const CloudinaryImage = (props: CldImageProps) => {
  return (
    <div className={cn("relative", `w-[${props.width}px] h-[${props.height}px]`)}>
      <CldImage
        {...props}
        fillBackground
        crop="fill"
        quality={80}
        format="webp"
        loading="lazy"
        placeholder="blur"
      />
    </div>
  );
};
// width, height, alt, src, sizes
