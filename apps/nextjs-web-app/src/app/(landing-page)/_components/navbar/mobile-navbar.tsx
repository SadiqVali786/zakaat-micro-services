import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { CompanyLogo } from "./company-logo";
import Link from "next/link";
import { NAVBAR_MENU_ITEMS } from "@/constants/app.constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { APP_PATHS } from "@/config/path.config";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

export const MobileNavbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild aria-label="mob-nav-menu" className="block md:hidden">
        <Menu className="h-8 w-8 text-blue-100" />
      </SheetTrigger>
      <SheetContent className="bg-neutral-12 w-full" side="right">
        <SheetHeader>
          <SheetTitle>
            <CompanyLogo />
          </SheetTitle>
          <ul className="mt-8 flex w-full flex-col items-start">
            {NAVBAR_MENU_ITEMS.map((item) => (
              <Link
                href={item.link}
                key={item.title}
                className={cn(
                  "text-neutral-7 w-full py-2 pl-2 text-lg font-normal",
                  pathname === item.link && "bg-neutral-11 text-xl text-blue-50"
                )}
              >
                {item.title}
              </Link>
            ))}
          </ul>
          <Separator className="my-8" />
          {status === "unauthenticated" && (
            <Link
              href={APP_PATHS.SIGNIN}
              className={cn(
                "mx-auto flex w-2xs items-center justify-center gap-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-5 py-2 text-xl leading-normal text-[#8e8c95]"
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
          )}
          {status === "authenticated" && (
            <div className="mt-8 flex flex-col items-start gap-y-4">
              {/* TODO: Add Sidebar menu items based on user role */}
              <Link
                href={APP_PATHS.HOME}
                onClick={() => signOut()}
                className={cn(
                  "mx-auto flex w-2xs items-center justify-center gap-2 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] px-5 py-2 text-xl leading-normal text-[#8e8c95]"
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
                  Logout
                </span>
              </Link>
            </div>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
