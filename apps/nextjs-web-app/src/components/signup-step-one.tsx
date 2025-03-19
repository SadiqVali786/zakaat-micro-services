/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ROLE } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

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

const SignupStepOne: React.FC<Props> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                className="flex w-full"
              >
                <div
                  className={cn(
                    "flex grow cursor-pointer items-center justify-center py-[10px]",
                    form.getValues().role === ROLE.DONOR
                      ? "border-neutral-11 rounded-xl border"
                      : ""
                  )}
                >
                  <RadioGroupItem value={ROLE.DONOR} id={ROLE.DONOR} className="hidden" />
                  <Label htmlFor={ROLE.DONOR} className="cursor-pointer text-base">
                    Donor
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex grow cursor-pointer items-center justify-center py-[10px]",
                    form.getValues().role === ROLE.ACCEPTOR
                      ? "border-neutral-11 rounded-xl border"
                      : ""
                  )}
                >
                  <RadioGroupItem value={ROLE.ACCEPTOR} id={ROLE.ACCEPTOR} className="hidden" />
                  <Label htmlFor={ROLE.ACCEPTOR} className="cursor-pointer text-base">
                    Applicant
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fullname"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                placeholder="Full Name"
                className="border-neutral-11 placeholder:text-neutral-7 w-full rounded-xl border px-5 py-[10px] text-base text-blue-50 placeholder:text-base"
                {...field}
                onBlur={async () => await form.trigger("fullname")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNum"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                placeholder="Phone Number"
                className="border-neutral-11 placeholder:text-neutral-7 w-full rounded-xl border px-5 py-[10px] text-base text-blue-50 placeholder:text-base"
                {...field}
                onBlur={async () => await form.trigger("phoneNum")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SignupStepOne;
