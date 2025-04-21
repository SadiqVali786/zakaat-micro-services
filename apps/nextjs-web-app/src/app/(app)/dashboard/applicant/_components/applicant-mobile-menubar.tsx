import { MobileMenubar } from "@/app/(app)/dashboard/_components/mobile-menubar";
import { ApplicantMenuItems } from "../_config/applicant-menu-items";

export const ApplicantMobileMenubar = () => {
  return (
    <MobileMenubar
      defaultValue="messages"
      MenubarItemList={ApplicantMenuItems.map((item) => ({
        ...item,
        Icon: item.icon
      }))}
    />
  );
};
