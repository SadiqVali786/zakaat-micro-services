"use client";
import React from "react";

import NavbarBrand from "./navbar-brand";
import WebNavbarMenu from "./web-navbar-menu";
import NavbarMenuToggle from "./navbar-menu-toggle";
import NavbarBackdrop from "./navbar-backdrop";
import NavbarAuthentication from "./navbar-authentication";
import MobileNavbarMenu from "./mobile-navbar-menu";

export default function Navbar() {
  return (
    <React.Fragment>
      <section
        className="border-neutral-11 mb-20 flex items-center justify-between border-b-[1px] py-8 sm:mb-44"
        style={{
          marginLeft: "clamp(1rem, 4.9vw, 5rem)",
          marginRight: "clamp(1rem, 4.9vw, 5rem)"
        }}
      >
        <NavbarBrand />
        <WebNavbarMenu />
        <NavbarAuthentication className="hidden md:flex" />
        <NavbarMenuToggle />
        <NavbarBackdrop />
        <MobileNavbarMenu />
      </section>
    </React.Fragment>
  );
}
