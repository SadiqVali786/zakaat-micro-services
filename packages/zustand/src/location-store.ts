import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type LocationState = {
  latitude: number;
  longitude: number;
  setLocation: (latitude: number, longitude: number) => void;
};

export const useDonorLocationStore = create<LocationState>()(
  immer(
    persist(
      (set) => ({
        latitude: 0,
        longitude: 0,
        setLocation: (latitude, longitude) => set({ latitude, longitude }),
      }),
      {
        name: "location",
      }
    )
  )
);
