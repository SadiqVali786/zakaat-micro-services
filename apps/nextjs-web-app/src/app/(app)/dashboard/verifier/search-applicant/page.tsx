"use client";

import { applySchema } from "../apply/_schema/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon } from "lucide-react";

import selfieInfoGraphic from "@/../public/info-graphics/selfie-info-graphic.png";
import { findSimilarFaces } from "@/actions/application.action";
import { BlackAndWhiteNextButton } from "@/components/global/black-and-white-next-button";
import { ColorfulNextButton } from "@/components/global/color-next-button";

const applySelfieSchema = applySchema.pick({
  selfie: true
});

type EncodedFaceResponse = {
  status?: "success";
  embedding?: number[];
  status_code?: number;
  detail?: string;
};

export default function SearchApplicantPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [similarFaces, setSimilarFaces] = useState<string[]>([]);

  const selfie = useApplyZakaatApplicationStore((state) => state.selfie);
  const setData = useApplyZakaatApplicationStore((state) => state.setData);
  const reset = useApplyZakaatApplicationStore((state) => state.reset);

  const form = useForm<z.infer<typeof applySelfieSchema>>({
    resolver: zodResolver(applySelfieSchema),
    defaultValues: {
      selfie: selfie
    }
  });

  const onSubmit = async (data: z.infer<typeof applySelfieSchema>) => {
    setData(data);
    // Encode the face with fastapi backend
    const fetchData = new FormData();
    fetchData.append("file", data.selfie);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FASTAPI_FACE_VERIFICATION_BE_URL}/encode_face`,
      { method: "POST", body: fetchData }
    );
    const result = (await response.json()) as EncodedFaceResponse;
    if (result?.status === "success") {
      // console.log(result);
      const encodedFace = result.embedding!;
      setData({ encodedFace });
      const response = await findSimilarFaces(encodedFace);
      // console.log("RESPONSE", response);
      if (response.success) {
        if (response.data && response.data.length > 0) {
          setSimilarFaces(response.data!);
        } else {
          setSimilarFaces([]);
          handleGenuineApplicant();
        }
      } else {
        console.error(response.error);
      }
    } else {
      console.error(result.detail);
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
                <Image src={selfieInfoGraphic} alt="take selfie info graphic" className="w-full" />
                <p className="w-[302px]">
                  To ensure your Zakaat application reaches those closest to you, like neighbors,
                  relatives, or friends, please provide a selfie. This helps them identify and
                  prioritize you. If privacy is a concern, rest assured, we won’t share your photo
                  or phone number. Simply click the &apos;Hide Details&apos; button while filling
                  out the application. Thank you for your trust and cooperation.
                </p>
                <FormField
                  control={form.control}
                  name="selfie"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className="flex max-h-[40px] w-full max-w-[302px] cursor-pointer items-center justify-center gap-x-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-4 py-2"
                          onClick={() => {
                            inputRef.current?.click();
                          }}
                        >
                          {field.value ? (
                            <span>Choose File {field.value.name}</span>
                          ) : (
                            <div className="flex items-center gap-x-2">
                              <CameraIcon />
                              <span>Take a Selfie</span>
                            </div>
                          )}
                          <Input
                            {...field}
                            type="file"
                            accept=".jpg, .jpeg, .png, .webp"
                            className="text-neutral-7 hidden border-none bg-transparent !text-lg font-bold outline-none file:hidden"
                            ref={inputRef}
                            value={undefined}
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                              // console.log(e.target.files?.[0]);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Button
                  type="submit"
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
                    Next
                  </span>
                </Button> */}
                <BlackAndWhiteNextButton />
              </form>
            </Form>
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
