"use client";
import { IKImage, IKUpload, IKVideo, ImageKitProvider } from "imagekitio-next";
import {
  IKUploadResponse,
  UploadError
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { useCallback, useRef } from "react";

type MediaProps = {
  className?: string;
  path: string;
  alt?: string;
};

export const Image = ({ className, path, alt = "Alt text" }: MediaProps) => {
  return (
    <div className={`relative ${className}`}>
      <IKImage
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        path={path}
        className="h-full w-full object-cover"
        alt={alt}
        loading="lazy"
        fill
        lqip={{ active: true, quality: 20 }}
      />
    </div>
  );
};

export const Video = ({ className, path }: MediaProps) => {
  return (
    <div className={`relative ${className}`}>
      <IKVideo
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        path={path}
        className="h-full w-full object-cover"
        poster={`${process.env.NEXT_PUBLIC_URL_ENDPOINT!}${path}?tr=q-20,bl-10`} // Blurred preview
        playsInline
        controls
        autoPlay={false}
        loop={false}
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

  const authenticator = useCallback(async () => {
    const res = await fetch("/api/image-kit-auth");
    if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
    return res.json();
  }, []);

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
