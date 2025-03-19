"use client";

import Image, { StaticImageData } from "next/image";
import More from "@/../public/Icons/dashboard/more_horizontal_shade.png";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PropTypes = {
  title: string;
  icon: StaticImageData;
  path: string;
};

export default function SubMenu({ title, icon, path }: PropTypes) {
  const pathname = usePathname();

  return (
    <Link
      href={path}
      className={cn(
        "flex w-full items-center gap-x-2 py-[10px] lg:px-[10px]",
        pathname.includes(path) ? "bg-neutral-11" : ""
      )}
    >
      <Image src={icon} alt="tweets icon" className="mx-auto lg:mx-0" />
      <div className="hidden grow items-center justify-between gap-x-2 lg:flex">
        <span>{title}</span>
        <Image src={More} alt="more" />
      </div>
    </Link>
  );
}
