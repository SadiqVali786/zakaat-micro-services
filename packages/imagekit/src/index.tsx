"use client";

import { IKImage, IKUpload, IKVideo, ImageKitProvider } from "imagekitio-next";
import type {
  IKUploadResponse,
  UploadError
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { useCallback, useRef } from "react";
import { cn } from "./lib/utils";

type MediaProps = {
  className: string;
  path: string;
  alt?: string;
};

// TODO: className should consists of width and height values for sure
export const Image = ({ className, path, alt = "Alt text" }: MediaProps) => {
  return (
    <div className={cn("relative", className)}>
      <IKImage
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        path={path}
        fill
        className="h-full w-full object-contain" // object-cover https://www.youtube.com/watch?v=8lDxivEusUc
        alt={alt}
        loading="lazy"
        lqip={{ active: true, quality: 20 }}
      />
    </div>
  );
};

// TODO: className should consists of width and height values for sure
export const Video = ({ className, path }: MediaProps) => {
  return (
    <div className={cn("relative", className)}>
      <IKVideo
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        path={path}
        className="h-full w-full object-contain"
        poster={`${process.env.NEXT_PUBLIC_URL_ENDPOINT!}${path}?tr=q-20,bl-10`} // Blurred preview
        playsInline={false}
        controls
        autoPlay={true}
        loop={true}
        muted
      />
    </div>
  );
};

export const Upload = ({ children }: { children: React.ReactNode }) => {
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const handleSuccess = useCallback((response: IKUploadResponse) => {
    console.log("Upload Success:", response);
  }, []);

  const handleError = useCallback((err: UploadError) => {
    console.error("Upload Error:", err);
  }, []);

  const handleProgress = useCallback((progress: ProgressEvent) => {
    console.log("Upload Progress:", progress);
  }, []);

  const authenticator = async () => {
    try {
      console.log("STARTED 1", process.env.NEXT_PUBLIC_BASE_URL_LOCAL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_LOCAL}/api/image-kit-auth`);
      console.log("STARTED 2");
      console.log({ response });
      if (!response.ok) {
        console.log("STARTED 3");
        const errorText = await response.text();
        console.log("STARTED 4");
        throw new Error(`Auth failed: ${response.status}: ${errorText}`);
      }
      console.log("STARTED 5");
      const data = await response.json();
      console.log("STARTED 6");
      const { signature, expire, token } = data;
      console.log("STARTED 7");
      return { signature, expire, token };
    } catch (error) {
      console.log("STARTED 8");
      throw new Error(`Authentication request failed: ${(error as Error).message}`);
    }
  };

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        ref={uploadRef}
        useUniqueFileName
        onSuccess={handleSuccess}
        onError={handleError}
        onUploadProgress={handleProgress}
        style={{ display: "none" }}
      />
      <div onClick={() => uploadRef.current?.click()}>{children}</div>
    </ImageKitProvider>
  );
};
