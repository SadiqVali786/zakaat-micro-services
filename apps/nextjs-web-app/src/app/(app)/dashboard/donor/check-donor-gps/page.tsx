"use client";
import { useRouter } from "next/navigation";
import { useDonorLocationStore } from "@repo/zustand/src/location-store";
import { useEffect } from "react";
import gpsInfoGraphic from "@/../public/info-graphics/gps-info-graphics.png";
import Image from "next/image";
import { MapPinCheckInside } from "lucide-react";
import { APP_PATHS } from "@/config/path.config";
import { UserRole } from "@repo/common/types";
import { useSession } from "next-auth/react";

export default function CollectGpsValues() {
  const router = useRouter();

  const { data: session } = useSession();
  if (session?.user.role !== UserRole.Donor) {
    if (session?.user.role === UserRole.Applicant) {
      router.push(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
    } else if (session?.user.role === UserRole.Verifier) {
      router.push(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
    } else {
      router.push(APP_PATHS.HOME);
    }
  }

  const setLocation = useDonorLocationStore((state) => state.setLocation);
  const latitude = useDonorLocationStore((state) => state.latitude);
  const longitude = useDonorLocationStore((state) => state.longitude);

  useEffect(() => {
    if (latitude && longitude) {
      router.push(
        `/dashboard/donor/zakaat-applications?longitude=${longitude}&latitude=${latitude}`
      );
    }
  }, [latitude, longitude, router]);

  const setLatAndLongValues = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
          router.push(
            `/dashboard/donor/zakaat-applications?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}`
          );
        },
        (error) => console.error("Error fetching GPS values:", error)
      );
    } else console.error("Geolocation is not supported by this browser.");
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-neutral-11 flex h-fit w-fit flex-col space-y-5 rounded-[1.25rem] border p-8 shadow-[0px_10px_20px_-8px_#8e8c95]">
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
      </div>
    </div>
  );
}
