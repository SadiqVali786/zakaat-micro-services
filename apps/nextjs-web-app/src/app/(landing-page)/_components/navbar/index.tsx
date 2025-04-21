"use client";

import React from "react";
import { CompanyLogo } from "./company-logo";
import { MobileNavbar } from "./mobile-navbar";
import { NavbarActions } from "./navbar-actions";
import { WebnavbarMenu } from "./web-navbar-menu";

export const Navbar = () => {
  return (
    <nav className="border-neutral-11 px-8-to-40-with-375-to-768 md:px-40-to-80-with-768-to-1440 flex h-20 w-full items-center justify-between border-b py-8 sm:h-[6.25rem] md:h-[7.5rem]">
      <CompanyLogo />
      <WebnavbarMenu />
      <NavbarActions />
      <MobileNavbar />
    </nav>
  );
};
