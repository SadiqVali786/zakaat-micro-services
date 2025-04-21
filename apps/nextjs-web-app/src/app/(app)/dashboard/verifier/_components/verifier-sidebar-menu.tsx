"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { CustomSidebarMenuItem } from "../../_components/custom-sidebar-menu-item";
import { VerifierMenuItems } from "../_config/verifier-menu-items";

export const VerifierSidebarMenu = () => {
  return (
    <SidebarMenu>
      {VerifierMenuItems.map((item) => (
        <CustomSidebarMenuItem
          key={item.title}
          title={item.title}
          url={item.url}
          Icon={item.icon}
        />
      ))}
    </SidebarMenu>
  );
};
