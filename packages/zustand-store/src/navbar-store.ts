import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./create-selectors";

type NavbarStoreType = {
  openMobileNavbar: boolean;
  setOpenMobileNavbar: (open: boolean) => void;
};

const useNavbarStore = create<NavbarStoreType>()(
  immer(
    persist(
      (set) => ({
        openMobileNavbar: false,
        setOpenMobileNavbar: (open: boolean) => set(() => ({ openMobileNavbar: open }))
      }),
      { name: "navbar-store" }
    )
  )
);

export const useNavbarStoreSelector = createSelectors(useNavbarStore);
