"use client";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  icon: StaticImageData;
  text: string;
  className?: string;
  href?: string;
};

const LinkComponent: React.FC<Props> = ({ icon, text, className = "", href = "#" }) => {
  const pathname = usePathname();

  return (
    <React.Fragment>
      <Link
        href={href}
        className={cn(
          "px-[18px] py-[24px]",
          pathname.includes(text) ? "bg-neutral-10" : "",
          className
        )}
      >
        <Image alt="diamond" src={icon} className="" />
      </Link>
    </React.Fragment>
  );
};

export default LinkComponent;
