/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICONS } from "@/lib/icons";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ROLE } from "@prisma/client";
import { IMAGES } from "@/lib/images";

type Props = {
  form: UseFormReturn<
    {
      fullname: string;
      phoneNum: string;
      selfie: File;
      latitude: number;
      longitude: number;
      role: "ADMIN" | "DONOR" | "ACCEPTOR" | "VERIFIER";
    },
    any,
    undefined
  >;
};

const SignupStepTwo: React.FC<Props> = ({ form }) => {
  const inputValues = form.watch();
  return (
    <>
      <Image src={IMAGES["selfie-info-graphic"]} alt="take selfie info graphic" />
      <p className="w-[302px]">
        {inputValues.role === ROLE.DONOR
          ? "To respect the applicant&apos;s dignity, we’ll share your photo with them before proceeding with your Zakat donation. Some relatives, friends, or neighbors may prefer not to accept Zakat from you. If they decline, you can choose another recipient. Thank you for your understanding."
          : "To ensure your Zakaat application reaches those closest to you, like neighbors, relatives, or friends, please provide a selfie. This helps them identify and prioritize you. If privacy is a concern, rest assured, we won’t share your photo or phone number. Simply click the 'Hide Details' button while filling out the application. Thank you for your trust and cooperation."}
      </p>
      <FormField
        control={form.control}
        name="selfie"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="flex max-h-[40px] w-full max-w-[302px] items-center justify-center gap-x-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-4 py-2">
                <Image src={ICONS.camera} alt="icon" className="h-6 w-6" />
                <Input
                  {...field}
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  className="text-neutral-7 border-none bg-transparent !text-lg font-bold outline-none file:hidden"
                  value={undefined}
                  onChange={(e: any) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SignupStepTwo;
