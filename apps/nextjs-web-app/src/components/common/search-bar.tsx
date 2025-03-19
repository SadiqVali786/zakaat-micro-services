"use client";

import Image from "next/image";
import searchIcon from "@/../public/Icons/dashboard/search.png";
import { usePathname, useRouter } from "next/navigation";
import APP_PATHS from "@/config/path.config";

const Searchbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="bg-neutral-11 flex w-full items-center rounded-full px-5 py-[10px]">
      <Image src={searchIcon} alt="Search Icon" />
      <input
        type="text"
        placeholder={pathname.includes(APP_PATHS.TWEETS) ? "Search tweets" : "Search Applications"}
        className="placeholder:text-neutral-7 font-dm ml-2 w-full bg-transparent text-xl text-blue-50 outline-none"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            const input = event.target as HTMLInputElement;
            const searchTerm = input.value.trim();
            if (searchTerm) {
              router.push(
                `${
                  pathname.includes(APP_PATHS.TWEETS) ||
                  pathname.includes(APP_PATHS.FOLLOWING_TWEETS)
                    ? APP_PATHS.SEARCH_TWEETS
                    : APP_PATHS.SEARCH_APPLICATIONS
                }?searchTerm=${searchTerm}`
              );
            }
          }
        }}
      />
    </div>
  );
};

export default Searchbar;
