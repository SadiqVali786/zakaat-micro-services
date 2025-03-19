"use client";

import { cn } from "@/lib/utils";
import { useNavbarStoreSelector } from "@repo/zustand-store/navbar-store";

const NavbarBackdrop = () => {
  const setOpenMobileNavbar = useNavbarStoreSelector.use.setOpenMobileNavbar();
  const openMobileNavbar = useNavbarStoreSelector.use.openMobileNavbar();

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-50 h-screen w-screen backdrop-blur-lg",
        openMobileNavbar ? "" : "hidden"
      )}
      onClick={() => setOpenMobileNavbar(false)}
    />
  );
};

export default NavbarBackdrop;
