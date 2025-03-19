"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { startTransition, useActionState } from "react";
import { createApplicationAction } from "@/actions/application.actions";
import useAuthorization from "@/hooks/useAuthorization";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import { applicationSchema } from "@/validators/application.validator";

const FormWithShadcn = () => {
  const { session, router, pathname } = useAuthorization();
  const [actionState, action, isPending] = useActionState(createApplicationAction, null);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      phoneNum: "",
      amount: 0,
      reason: "",
      rating: 0,
      hide: false
    }
  });

  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    try {
      await startTransition(async () => {
        await action(values);
      });
      // handleActionToast(actionState);
    } catch (error) {
      // spawnaToast("Internal server error", "destructive");
    }
  }

  return (
    <>
      <InfiniteFeedbar type="path" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pt-10">
          <FormField
            control={form.control}
            name="phoneNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter UPI Phone Number"
                    {...field}
                    className="bg-neutral-11 text-blue-50"
                  />
                </FormControl>
                <FormDescription>Enter the UPI linked phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                    step="1000"
                    placeholder="Enter amount"
                    className="bg-neutral-11 text-blue-50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the amount needed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eligibility Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why do you think he/she is eligible for Zakaat?"
                    className="bg-neutral-11 resize-none text-blue-50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Please provide detailed reasoning</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Application Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                    min={0}
                    max={10}
                    placeholder="Rate from 0-10"
                    className="bg-neutral-11 text-blue-50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Rate the application out of 10</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hide"
            render={({ field }) => (
              <FormItem className="bg-neutral-11 flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Hide My Identity</FormLabel>
                  <FormDescription>
                    Recommended to reveal your identity to increase the chances of getting help
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="bg-brand-dark border-neutral-7 w-full rounded-md border px-4 py-2 text-blue-50 transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Form>
    </>
  );
};

export default FormWithShadcn;
