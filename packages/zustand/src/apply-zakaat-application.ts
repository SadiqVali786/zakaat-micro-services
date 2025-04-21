import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type ApplyZakaatApplication = Partial<{
  email: string;
  upiId: string;
  selfie: File | undefined;
  encodedFace: number[];
  latitude: number;
  longitude: number;
  amount: number;
  rank: number;
  reason: string;
}>;

type ApplyZakaatApplicationStoreType = ApplyZakaatApplication & {
  setData: (data: Partial<ApplyZakaatApplication>) => void;
  reset: () => void;
};

export const useApplyZakaatApplicationStore =
  create<ApplyZakaatApplicationStoreType>()(
    immer(
      persist(
        (set) => ({
          email: "",
          upiId: "",
          selfie: undefined,
          encodedFace: [],
          latitude: 0,
          longitude: 0,
          amount: 0,
          rank: 0,
          reason: "",
          setData: (data: ApplyZakaatApplication) => set(data),
          reset: () =>
            set({
              email: "",
              upiId: "",
              selfie: undefined,
              latitude: 0,
              longitude: 0,
              amount: 0,
              rank: 0,
              reason: "",
              encodedFace: [],
            }),
        }),
        {
          name: "apply-zakaat-application",
        }
      )
    )
  );
