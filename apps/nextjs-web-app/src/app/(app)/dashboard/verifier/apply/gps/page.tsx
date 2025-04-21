"use client";

import { applySchema } from "../_schema/validation";
import { useRouter } from "next/navigation";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPinCheckInside } from "lucide-react";
import gpsInfoGraphic from "@/../public/info-graphics/gps-info-graphics.png";
import Image from "next/image";

const applyGpsSchema = applySchema.pick({
  latitude: true,
  longitude: true
});

export default function GPSPage() {
  const router = useRouter();
  const setData = useApplyZakaatApplicationStore((state) => state.setData);
  const latitude = useApplyZakaatApplicationStore((state) => state.latitude);
  const longitude = useApplyZakaatApplicationStore((state) => state.longitude);

  const setLatAndLongValues = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const validatedLatitude = applyGpsSchema.parse({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setData(validatedLatitude);
        },
        (error) => console.error("Error fetching GPS values:", error)
      );
    } else console.error("Geolocation is not supported by this browser.");
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-neutral-11 flex h-fit w-fit flex-col space-y-5 rounded-[1.25rem] p-8 sm:border sm:shadow-[0px_10px_20px_-8px_#8e8c95]">
        <Image src={gpsInfoGraphic} alt="take selfie info graphic" className="w-full" />
        <p className="w-[302px]">
          To ensure your Zakaat application reaches those closest to you, like neighbors, relatives,
          or friends, please provide a selfie. This helps them identify and prioritize you. If
          privacy is a concern, rest assured, we won’t share your photo or phone number. Simply
          click the &apos;Hide Details&apos; button while filling out the application. Thank you for
          your trust and cooperation.
        </p>
        <div
          className="flex max-h-[40px] w-full max-w-[302px] cursor-pointer items-center justify-center gap-x-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-4 py-2"
          onClick={setLatAndLongValues}
        >
          <div className="flex items-center gap-x-2">
            <MapPinCheckInside />
            {latitude && longitude ? (
              <span>
                {latitude}, {longitude}
              </span>
            ) : (
              <span>Get Location</span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="hover:bg-brand-dark bg-brand-dark m-0 mt-1 flex cursor-pointer items-center gap-2 self-end rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] !px-4 !py-5 text-xl leading-normal text-[#8e8c95]"
          disabled={!latitude || !longitude}
          onClick={() => router.push("/dashboard/verifier/apply/reason")}
        >
          <ArrowRight className="h-8 w-8" />
          <span
            style={{
              background: "linear-gradient(91deg, #8e8c95 0.61%, #d9d9dc 99.17%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
            className="text-xl leading-normal"
          >
            Next
          </span>
        </Button>
      </div>
    </div>
  );
}
