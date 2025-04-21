"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { CustomSidebarMenuItem } from "../../_components/custom-sidebar-menu-item";
import { ApplicantMenuItems } from "../_config/applicant-menu-items";

export const ApplicantSidebarMenu = () => {
  return (
    <SidebarMenu>
      {ApplicantMenuItems.map((item) => (
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
