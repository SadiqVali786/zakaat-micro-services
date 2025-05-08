"use client";

import { applySchema } from "../_schema/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { ArrowRight } from "lucide-react";
import { APP_PATHS } from "@/config/path.config";
import { useRouter } from "next/navigation";
import { CreateApplication } from "@/actions/application.action";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { UserRole } from "@repo/common/types";

const applyReasonSchema = applySchema.pick({
  amount: true,
  rank: true,
  reason: true
});

export default function ReasonPage() {
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

  const email = useApplyZakaatApplicationStore((state) => state.email);
  const upiId = useApplyZakaatApplicationStore((state) => state.upiId);
  const selfie = useApplyZakaatApplicationStore((state) => state.selfie);
  const latitude = useApplyZakaatApplicationStore((state) => state.latitude);
  const longitude = useApplyZakaatApplicationStore((state) => state.longitude);
  const encodedFace = useApplyZakaatApplicationStore((state) => state.encodedFace);
  const reset = useApplyZakaatApplicationStore((state) => state.reset);

  const form = useForm<z.infer<typeof applyReasonSchema>>({
    resolver: zodResolver(applyReasonSchema),
    defaultValues: {
      reason: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof applyReasonSchema>) => {
    try {
      if (!email || !upiId || !selfie || !latitude || !longitude || !encodedFace) {
        throw new Error("Missing required fields");
      }
      await CreateApplication({ email, upiId, selfie, latitude, longitude, encodedFace, ...data });
      // console.log({ email, upiId, selfie, latitude, longitude, encodedFace, ...data });
      reset();
      router.push(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-neutral-11 h-fit w-fit rounded-[1.25rem] p-8 sm:border sm:shadow-[0px_10px_20px_-8px_#8e8c95]">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-3">
            <span className="text-center text-lg font-bold text-blue-50">Zakaat Application</span>
            <p className="text-neutral-7 text-center text-base">
              Application Process almost completed
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Why do you think he/she is eligible for zakaat?"
                        {...field}
                        className="!bg-brand-dark placeholder:text-neutral-7 min-h-30 resize-none rounded-[0.75rem] placeholder:text-base focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Amount"
                        {...field}
                        className="!bg-brand-dark placeholder:text-neutral-7 h-10 rounded-[0.75rem] placeholder:text-base focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Application rating out of 10"
                        {...field}
                        className="!bg-brand-dark placeholder:text-neutral-7 h-10 rounded-[0.75rem] placeholder:text-base focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
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
                  Submit
                </span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
