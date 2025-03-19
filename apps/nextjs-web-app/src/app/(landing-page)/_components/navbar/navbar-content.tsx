"use client";

import { usePathname } from "next/navigation";
import NavbarItem from "./navbar-item";
import { NAVBAR_LINKS } from "@/constants/app.constant";

const NavbarContent = () => {
  const pathname = usePathname();

  return (
    <>
      {NAVBAR_LINKS.map((navbar_item) => (
        <NavbarItem
          key={navbar_item.title}
          pathname={pathname}
          title={navbar_item.title}
          link={navbar_item.link}
        />
      ))}
    </>
  );
};

export default NavbarContent;
