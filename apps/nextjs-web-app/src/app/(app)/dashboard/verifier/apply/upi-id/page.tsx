/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { applySchema } from "../_schema/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useApplyZakaatApplicationStore } from "@repo/zustand/src/apply-zakaat-application";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

const applyUPIIDSchema = applySchema.pick({
  upiId: true,
  email: true
});

export default function UPIIDPage() {
  const router = useRouter();
  const upiId = useApplyZakaatApplicationStore((state) => state.upiId);
  const email = useApplyZakaatApplicationStore((state) => state.email);

  const form = useForm<z.infer<typeof applyUPIIDSchema>>({
    resolver: zodResolver(applyUPIIDSchema),
    defaultValues: { upiId: upiId, email: email }
  });

  useEffect(() => {
    if (!useApplyZakaatApplicationStore.persist.hasHydrated) return;
    if (upiId && name) {
      router.push("/dashboard/verifier/apply/gps");
    }
  }, [upiId, name, router, useApplyZakaatApplicationStore.persist.hasHydrated]);

  const setData = useApplyZakaatApplicationStore((state) => state.setData);

  const onSubmit = (data: z.infer<typeof applyUPIIDSchema>) => {
    setData(data); // setData({ upiId: data.upiId, name: data.name });
    router.push("/dashboard/verifier/apply/gps");
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-neutral-11 h-fit w-fit rounded-[1.25rem] p-8 sm:border sm:shadow-[0px_10px_20px_-8px_#8e8c95]">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-3">
            <span className="text-center text-lg font-bold text-blue-50">Zakaat Application</span>
            <p className="text-neutral-7 text-center text-base">
              welcome! Please fill details to get started
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Applicant Email"
                        className="!bg-brand-dark h-10 rounded-[0.75rem] focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="UPI ID"
                        className="!bg-brand-dark h-10 rounded-[0.75rem] focus-visible:ring-0"
                        {...field}
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
                  Next
                </span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
