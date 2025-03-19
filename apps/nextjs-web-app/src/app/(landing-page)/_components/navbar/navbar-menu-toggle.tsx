"use client";

import Image from "next/image";
import HamburgerMenu from "@/../public/Icons/hamburgerMenu.png";
import { useNavbarStoreSelector } from "@repo/zustand-store/navbar-store";

const NavbarMenuToggle = () => {
  const setOpenMobileNavbar = useNavbarStoreSelector.use.setOpenMobileNavbar();

  return (
    <Image
      src={HamburgerMenu}
      alt={"hamberger menu"}
      className="cursor-pointer md:hidden"
      onClick={() => setOpenMobileNavbar(true)}
    />
  );
};

export default NavbarMenuToggle;
