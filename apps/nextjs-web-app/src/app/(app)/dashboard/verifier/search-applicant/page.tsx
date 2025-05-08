"use client";

import { useRouter } from "next/navigation";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { useState } from "react";
import Image from "next/image";

import selfieInfoGraphic from "@/../public/info-graphics/selfie-info-graphic.png";
import { ColorfulNextButton } from "@/components/global/color-next-button";

import { toast } from "sonner";
import { CloudinaryUpload } from "@/components/global/cloudinary-upload";
import { APP_PATHS } from "@/config/path.config";
import { UserRole } from "@repo/common/types";
import { useSession } from "next-auth/react";

export default function SearchApplicantPage() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session?.user.role !== UserRole.Verifier) {
    if (session?.user.role === UserRole.Applicant) {
      router.push(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
    } else if (session?.user.role === UserRole.Donor) {
      router.push(APP_PATHS.DONOR_DASHBOARD_MESSAGES);
    } else {
      router.push(APP_PATHS.HOME);
    }
  }

  const [similarFaces, setSimilarFaces] = useState<string[]>([]);

  const setData = useApplyZakaatApplicationStore((state) => state.setData);
  const reset = useApplyZakaatApplicationStore((state) => state.reset);

  const handleCloudinarySuccess = (url: string) => {
    setData({ selfie: url });
  };
  const handleCloudinaryError = (error: string) => {
    toast.error(error);
  };

  const handleFraudApplicant = () => {
    reset();
    setSimilarFaces([]);
  };
  const handleGenuineApplicant = () => {
    router.push("/dashboard/verifier/apply/upi-id");
  };

  return (
    <>
      {similarFaces.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="border-neutral-11 h-fit w-fit rounded-[1.25rem] p-8 sm:border sm:shadow-[0px_10px_20px_-8px_#8e8c95]">
            <div className="flex flex-col space-y-8">
              <Image src={selfieInfoGraphic} alt="take selfie info graphic" className="w-full" />
              <p className="w-[302px]">
                To ensure your Zakaat application reaches those closest to you, like neighbors,
                relatives, or friends, please provide a selfie. This helps them identify and
                prioritize you. If privacy is a concern, rest assured, we won’t share your photo or
                phone number. Simply click the &apos;Hide Details&apos; button while filling out the
                application. Thank you for your trust and cooperation.
              </p>

              <CloudinaryUpload
                onSuccess={handleCloudinarySuccess}
                onError={handleCloudinaryError}
                setSimilarFaces={setSimilarFaces}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 p-8">
          <h1 className="text-center text-2xl leading-normal font-bold text-blue-50">
            If applicant is present in the list below, Click on the image. <br />
            Else click on Next
          </h1>
          <div
            className="flex w-full flex-wrap items-center justify-center gap-2.5"
            onClick={handleFraudApplicant}
          >
            {similarFaces.map((face) => (
              <Image
                src={face}
                alt="similar face"
                width={320}
                height={320}
                key={face}
                className="bg-neutral-11 aspect-square h-80 w-80 cursor-pointer object-contain"
              />
            ))}
          </div>
          <ColorfulNextButton onClick={handleGenuineApplicant} className="self-end" />
        </div>
      )}
    </>
  );
}
