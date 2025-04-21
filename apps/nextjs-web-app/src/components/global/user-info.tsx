import { getInitials } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

export const UserInfoCard = async ({ rank, className }: { rank?: string; className?: string }) => {
  const session = await auth();

  return (
    <div
      className={cn(
        "border-neutral-10 from-brand-dark to-neutral-11 mx-auto flex w-fit cursor-pointer items-center justify-between rounded-full border bg-gradient-to-b lg:w-full lg:px-6 lg:py-3",
        className
      )}
    >
      <div className="flex items-center justify-center gap-x-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback>{getInitials(session?.user?.name || "")}</AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-tight lg:flex">
          <p className="text-blue-50">{session?.user?.name}</p>
          <p className="text-neutral-7">{session?.user?.email.split("@")[0]}</p>
        </div>
      </div>
      {rank ? (
        <p className="font hidden text-2xl text-blue-50 lg:block">+{rank}</p>
      ) : (
        <MoreHorizontal className="ml-auto hidden lg:block" />
      )}
    </div>
  );
};
