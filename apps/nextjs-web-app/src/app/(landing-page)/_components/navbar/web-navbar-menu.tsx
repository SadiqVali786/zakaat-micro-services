"use client";

import {
  APPLICANT_NAVBAR_MENU_ITEMS,
  ADMIN_NAVBAR_MENU_ITEMS,
  DONOR_NAVBAR_MENU_ITEMS,
  GUEST_NAVBAR_MENU_ITEMS,
  VERIFIER_NAVBAR_MENU_ITEMS
} from "@/constants/app.constant";
import { cn } from "@/lib/utils";
import { UserRole } from "@repo/common/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const WebnavbarMenu = () => {
  const pathname = usePathname();
  const { status, data: session } = useSession();

  return (
    <ul className="border-neutral-11 hidden items-center gap-x-4 rounded-2xl border px-8 py-4 md:flex">
      {status !== "authenticated"
        ? GUEST_NAVBAR_MENU_ITEMS.map((item) => (
            <Link
              href={item.link}
              key={item.title}
              className={cn(
                "text-neutral-7 text-lg font-normal hover:text-blue-50",
                pathname === item.link && "text-xl text-blue-50"
              )}
            >
              {item.title}
            </Link>
          ))
        : status === "authenticated" && session?.user?.role === UserRole.Applicant
          ? APPLICANT_NAVBAR_MENU_ITEMS.map((item) => (
              <Link
                href={item.link}
                key={item.title}
                className={cn(
                  "text-neutral-7 text-lg font-normal hover:text-blue-50",
                  pathname === item.link && "text-xl text-blue-50"
                )}
              >
                {item.title}
              </Link>
            ))
          : status === "authenticated" && session?.user?.role === UserRole.Verifier
            ? VERIFIER_NAVBAR_MENU_ITEMS.map((item) => (
                <Link
                  href={item.link}
                  key={item.title}
                  className={cn(
                    "text-neutral-7 text-lg font-normal hover:text-blue-50",
                    pathname === item.link && "text-xl text-blue-50"
                  )}
                >
                  {item.title}
                </Link>
              ))
            : status === "authenticated" && session?.user?.role === UserRole.Donor
              ? DONOR_NAVBAR_MENU_ITEMS.map((item) => (
                  <Link
                    href={item.link}
                    key={item.title}
                    className={cn(
                      "text-neutral-7 text-lg font-normal hover:text-blue-50",
                      pathname === item.link && "text-xl text-blue-50"
                    )}
                  >
                    {item.title}
                  </Link>
                ))
              : ADMIN_NAVBAR_MENU_ITEMS.map((item) => (
                  <Link
                    href={item.link}
                    key={item.title}
                    className={cn(
                      "text-neutral-7 text-lg font-normal hover:text-blue-50",
                      pathname === item.link && "text-xl text-blue-50"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
    </ul>
  );
};
