import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_PATHS } from "@/config/path.config";
import { cn, getInitials } from "@/lib/utils";
import { LogOutIcon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const NavbarActions = () => {
  const { data: session, status } = useSession();

  return (
    <div className="hidden md:block">
      {status === "loading" ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : status === "unauthenticated" ? (
        <Link
          href={APP_PATHS.SIGNIN}
          className={cn(
            "items-center gap-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-5 py-2 text-xl leading-normal text-[#8e8c95]"
          )}
        >
          <span
            style={{
              background: "linear-gradient(91deg, #8e8c95 0.61%, #d9d9dc 99.17%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
            className="text-xl leading-normal"
          >
            Login
          </span>
        </Link>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-neutral-7">
                {getInitials(session?.user?.name || "")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-12 w-45" align="end">
            <DropdownMenuItem className="hover:!bg-brand-dark">
              <Link
                href={APP_PATHS.PROFILE + `?id=${session?.user?.id}`}
                className="flex w-full items-center justify-start gap-x-2"
              >
                <UserIcon className="h-4 w-4 text-blue-50" />
                <span className="text-blue-50">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="hover:!bg-brand-dark">
              <div className="flex w-full cursor-pointer items-center justify-start gap-x-2">
                <LogOutIcon className="h-4 w-4 text-blue-50" />
                <span className="text-blue-50">Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
