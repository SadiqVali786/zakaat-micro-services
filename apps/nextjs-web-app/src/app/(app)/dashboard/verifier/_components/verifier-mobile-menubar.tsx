import { MobileMenubar } from "../../_components/mobile-menubar";
import { VerifierMenuItems } from "../_config/verifier-menu-items";

export const VerifierMobileMenubar = () => {
  return (
    <MobileMenubar
      defaultValue="search-applicant"
      MenubarItemList={VerifierMenuItems.map((item) => ({
        ...item,
        Icon: item.icon
      }))}
    />
  );
};
