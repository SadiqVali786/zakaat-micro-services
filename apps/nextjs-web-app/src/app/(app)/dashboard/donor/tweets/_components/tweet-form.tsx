"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTweet } from "@/actions/tweet.action";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const tweetFormSchema = z.object({
  tweet: z.string().min(1)
});

export default function TweetForm() {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof tweetFormSchema>>({
    resolver: zodResolver(tweetFormSchema),
    defaultValues: {
      tweet: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof tweetFormSchema>) => {
    try {
      await CreateTweet(data.tweet);
      // console.log(data);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border-neutral-11 z-10 flex min-h-44 border-b-[1px] p-4 pt-2 sm:min-h-52 sm:p-8 sm:pt-6">
      <Avatar className="h-12 w-12">
        <AvatarImage src={session?.user?.image || ""} />
        <AvatarFallback>
          <Badge className="bg-neutral-11 h-12 w-12">
            <span className="text-2xl text-blue-50">{session?.user?.name?.[0]}</span>
          </Badge>
        </AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-1 flex-col">
          <FormField
            control={form.control}
            name="tweet"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="min-h-30 resize-none border-0 !bg-transparent !text-lg placeholder:text-lg focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button
            className="mt-2 scale-100 cursor-pointer self-end rounded-[0.5rem] bg-gradient-to-r from-[#4135F3] to-[#BE52F2] p-0.25 transition-all duration-200 active:scale-95"
            type="submit"
          >
            <div className="bg-brand-dark flex gap-x-2 rounded-[0.5rem] px-4 py-2">
              <Rocket color="#4135f3" />
              <span>Post</span>
            </div>
          </button>
        </form>
      </Form>
    </div>
  );
}
