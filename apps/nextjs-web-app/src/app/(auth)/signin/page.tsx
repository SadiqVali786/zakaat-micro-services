"use client";

import useAuthorization from "@/hooks/useAuthorization";
import { LOGOS } from "@/lib/media-imports/logos";
import { signIn } from "next-auth/react";
import Image from "next/image";

const SigninPage = () => {
  const { pathname, router, session } = useAuthorization();
  const handleGoogleSignIn = async () => {
    try {
      await signIn("github");
      // spawnaToast("Login Successful", "default");
    } catch (error) {
      // spawnaToast("Internal server error", "destructive");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border-neutral-11 h-fit w-fit rounded-[1.25rem] border p-[30px] shadow-[0px_10px_20px_-8px_#8e8c95]">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-3">
            <span className="text-brand-blue text-lg font-bold">Sign In</span>
            <p className="">to continue to use Zakaat Web Application</p>
          </div>
          <div
            className="border-neutral-11 flex w-[300px] cursor-pointer items-center justify-center gap-x-5 rounded-xl border px-5 py-[10px]"
            onClick={handleGoogleSignIn}
          >
            <Image src={LOGOS["google-logo"]} alt="Google logo" />
            <span>Continue with Google</span>
          </div>
          <p className="w-full text-left">
            No account? <span className="cursor-pointer text-[#4135f3]">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
