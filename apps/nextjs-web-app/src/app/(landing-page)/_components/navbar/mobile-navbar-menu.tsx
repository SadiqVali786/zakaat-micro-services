import { cn } from "@/lib/utils";
import NavbarContent from "./navbar-content";
import NavbarAuthentication from "./navbar-authentication";
import { useNavbarStoreSelector } from "@repo/zustand-store/navbar-store";

const MobileNavbarMenu = () => {
  const openMobileNavbar = useNavbarStoreSelector.use.openMobileNavbar();

  return (
    <div
      className={cn(
        "bg-brand-dark fixed right-0 top-0 z-50 flex h-screen min-w-80 transform flex-col items-center gap-4 py-20 transition-transform duration-500",
        openMobileNavbar ? "translate-x-0" : "translate-x-full"
      )}
    >
      <ul className="flex flex-col items-start gap-y-4 px-8 py-4">
        <NavbarContent />
        <NavbarAuthentication className="mt-8 flex" />
      </ul>
    </div>
  );
};

export default MobileNavbarMenu;
