import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type CustomSidebarMenuItemProps = {
  title: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  url: string;
};

export const CustomSidebarMenuItem = ({ title, Icon, url }: CustomSidebarMenuItemProps) => {
  const pathname = usePathname();
  let isActive = pathname === url;
  if (pathname.includes("zakaat-applications") && title === "Zakaat Applications") {
    isActive = true;
  }
  if (pathname.includes("apply") && title === "Apply") {
    isActive = true;
  }
  if (pathname.includes("messages") && title === "Messages") {
    isActive = true;
  }

  return (
    <SidebarMenuItem
      className={cn(
        "hover:bg-neutral-11 active:bg-neutral-11 flex items-center justify-center py-1",
        isActive && "bg-neutral-11",
        title === "Apply" && "cursor-not-allowed"
      )}
    >
      <SidebarMenuButton
        asChild
        className={cn(
          "hover:bg-neutral-11 active:bg-neutral-11",
          isActive && "bg-neutral-11",
          title === "Apply" && "cursor-not-allowed"
        )}
        disabled={title === "Apply"}
      >
        <Link
          href={title === "Apply" ? "#" : url}
          className="flex items-center justify-center lg:justify-start"
        >
          <Icon className="!h-5 !w-5" />
          <span className="hidden text-lg lg:block">{title}</span>
        </Link>
      </SidebarMenuButton>
      <span className="mr-2 hidden lg:block">24</span>
    </SidebarMenuItem>
  );
};
