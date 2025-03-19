import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type BearState = {
  bears: number;
  increase: (by: number) => void;
};

export const useBearStore = create<BearState>()(
  immer(
    devtools(
      persist(
        (set) => ({
          bears: 0,
          increase: (by) =>
            set((state) => {
              state.bears += by;
            })
        }),
        {
          name: "bear-storage"
        }
      )
    )
  )
);
