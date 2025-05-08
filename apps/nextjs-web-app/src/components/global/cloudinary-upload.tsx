"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { findSimilarFaces } from "@/actions/application.action";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudinaryUploadProps {
  onSuccess: (url: string) => void;
  onError: (error: string) => void;
  setSimilarFaces: (similarFaces: string[]) => void;
}

export const CloudinaryUpload = ({
  onSuccess,
  onError,
  setSimilarFaces
}: CloudinaryUploadProps) => {
  const setData = useApplyZakaatApplicationStore((state) => state.setData);

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        sources: ["local", "camera"],
        multiple: false,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        folder: "zakaat/applicants/selfies"
      }}
      onSuccess={(result, { widget }) => {
        const info = result.info as CloudinaryUploadWidgetInfo;
        if (info?.secure_url) {
          onSuccess(info.secure_url);
        }
      }}
      onQueuesEnd={(result, { widget }) => {
        widget.close();
      }}
      onSourceChanged={async (result) => {
        const file = result.info as unknown as File;
        if (file && file?.name) {
          try {
            const fetchData = new FormData();
            fetchData.append("file", file);
            const response = await findSimilarFaces(fetchData);
            if (response?.success) {
              if (response.data && response.data.similarFaces.length > 0) {
                setData({ encodedFace: response.data.faceEmbedding });
                setSimilarFaces(response.data.similarFaces);
                return true;
              } else {
                setSimilarFaces([]);
                onError("Please upload a clear selfie.");
                return false;
              }
            } else {
              onError(response.error!);
              return false;
            }
          } catch (error) {
            onError("An error occurred during face verification");
            return false;
          }
        }
      }}
    >
      {({ open }) => {
        return (
          <Button
            onClick={() => {
              open();
            }}
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
        );
      }}
    </CldUploadWidget>
  );
};
