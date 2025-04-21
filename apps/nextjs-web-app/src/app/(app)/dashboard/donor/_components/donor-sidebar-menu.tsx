"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { DonorMenuItems } from "../_config/donor-menu-items";
import { CustomSidebarMenuItem } from "../../_components/custom-sidebar-menu-item";
import { useDonorLocationStore } from "@repo/zustand/src/location-store";

export const DonorSidebarMenu = () => {
  return (
    <SidebarMenu>
      {DonorMenuItems.map((item) => (
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
