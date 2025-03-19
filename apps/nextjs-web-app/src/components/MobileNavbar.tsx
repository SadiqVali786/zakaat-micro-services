import Image from "next/image";
import Diamond from "@/../public/Icons/dashboard/diamond.png";
import Bookmark from "@/../public/Icons/dashboard/bookmark.png";
import List from "@/../public/Icons/dashboard/list.png";
import Archive from "@/../public/Icons/dashboard/archive.png";
import Search from "@/../public/Icons/dashboard/search-black.png";
import DP from "@/../public/dashboard/dp.png";
import Link from "next/link";
import LinkComponent from "./link-component";

const MobileNavbar = () => {
  return (
    <div className="border-neutral-11 xs:hidden sticky bottom-0 z-50 gap-x-4 border-x-[1px] border-t-[1px] backdrop-blur-3xl">
      <div className="mx-auto flex max-w-fit items-center">
        <Link href="#" className="p-3">
          <Image alt="diamond" src={DP} />
        </Link>
        <LinkComponent icon={Diamond} text="tweets" />
        <LinkComponent icon={Bookmark} text="bookmarks" />
        <LinkComponent icon={List} text="bookmarks" />
        <LinkComponent icon={Archive} text="bookmarks" />
        <LinkComponent icon={Search} text="bookmarks" />
      </div>
    </div>
  );
};

export default MobileNavbar;
