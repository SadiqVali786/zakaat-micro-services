"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ColorfulNextButton } from "@/components/global/color-next-button";

import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";

import { APP_PATHS } from "@/config/path.config";
import { UserRole } from "@repo/common/types";
import { useUploadThing } from "@/utils/uploadthing"; // custom hook wrapper
import { findSimilarFaces } from "@/actions/application.action";

import selfieInfoGraphic from "@/../public/info-graphics/selfie-info-graphic.png";

export default function SearchApplicantPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [similarFaces, setSimilarFaces] = useState<string[]>([]);
  const fileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setData = useApplyZakaatApplicationStore((state) => state.setData);
  const reset = useApplyZakaatApplicationStore((state) => state.reset);

  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (session?.user.role !== UserRole.Verifier) {
      if (session?.user.role === UserRole.Applicant) {
        router.push(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
      } else if (session?.user.role === UserRole.Donor) {
        router.push(APP_PATHS.DONOR_DASHBOARD_MESSAGES);
      } else {
        router.push(APP_PATHS.HOME);
      }
    }
  }, [session, router]);

  const handleImageUploadSuccess = (url: string) => {
    setData({ selfie: url });
    console.log({ url });
  };
  const handleImageUploadError = (error: string) => {
    toast.error(error);
  };

  const handleFraudApplicant = () => {
    reset();
    setSimilarFaces([]);
  };
  const handleGenuineApplicant = async () => {
    setSimilarFaces([]);
    if (!fileRef.current) return;
    const uploaded = await startUpload([fileRef.current]);
    if (uploaded && uploaded[0]?.ufsUrl) {
      setData({ selfie: uploaded[0].ufsUrl });
      handleImageUploadSuccess(uploaded[0].ufsUrl);
    }
    router.push("/dashboard/verifier/apply/upi-id");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileRef.current = file;

    const formData = new FormData();
    formData.append("file", file);

    const response = await findSimilarFaces(formData);
    console.log("[FACE VERIFICATION + MONGODB] Response:", response);

    if (response?.success && response.data) {
      if (response.data.similarFaces.length > 0) {
        setData({ encodedFace: response.data.faceEmbedding });
        setSimilarFaces(response.data.similarFaces);
      } else {
        setSimilarFaces([]);
        handleImageUploadError("Please upload a clear selfie.");
      }
    } else {
      handleImageUploadError("Face verification failed.");
    }
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
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => inputRef.current?.click()}
                  className="hover:bg-brand-dark bg-brand-dark m-0 mt-1 flex cursor-pointer items-center gap-2 self-end rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] !px-4 !py-5 text-xl leading-normal text-[#8e8c95]"
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
                    Upload
                  </span>
                </Button>
              </>
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
