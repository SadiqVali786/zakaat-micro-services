import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./create-selectors";

type ApplicationStateType = {
  fullname: string | undefined;
  phoneNum: string | undefined;
  amount: number | undefined;
  reason: string | undefined;
  rating: number | undefined;
  hide: boolean | undefined;
  setFullname: (fullname: string) => void;
  setPhoneNum: (phoneNum: string) => void;
  setAmount: (amount: number) => void;
  setReason: (reason: string) => void;
  setRating: (rating: number) => void;
  setHide: (hide: boolean) => void;
  reset: () => void;
};

const useApplicationStore = create<ApplicationStateType>()(
  immer(
    persist(
      (set) => ({
        fullname: undefined,
        phoneNum: undefined,
        amount: undefined,
        reason: undefined,
        rating: undefined,
        hide: undefined,
        setFullname: (fullname: string) => set(() => ({ fullname })),
        setPhoneNum: (phoneNum: string) => set(() => ({ phoneNum })),
        setAmount: (amount: number) => set(() => ({ amount })),
        setReason: (reason: string) => set(() => ({ reason })),
        setRating: (rating: number) => set(() => ({ rating })),
        setHide: (hide: boolean) => set(() => ({ hide })),
        reset: () =>
          set({
            fullname: undefined,
            phoneNum: undefined,
            amount: undefined,
            reason: undefined,
            rating: undefined,
            hide: undefined
          })
      }),
      { name: "applicationStore" }
    )
  )
);

export const useApplicationStoreSelector = createSelectors(useApplicationStore);
