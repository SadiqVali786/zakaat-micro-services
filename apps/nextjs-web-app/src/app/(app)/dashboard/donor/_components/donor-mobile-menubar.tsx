import { MobileMenubar } from "@/app/(app)/dashboard/_components/mobile-menubar";
import { DonorMobileMenuItems } from "../_config/donor-mobile-menu-items";

export const DonorMobileMenubar = () => {
  return <MobileMenubar defaultValue="tweets" MenubarItemList={DonorMobileMenuItems} />;
};
