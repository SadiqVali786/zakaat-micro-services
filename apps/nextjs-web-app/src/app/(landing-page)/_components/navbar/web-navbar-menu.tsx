import { NAVBAR_MENU_ITEMS } from "@/constants/app.constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const WebnavbarMenu = () => {
  const pathname = usePathname();

  return (
    <ul className="border-neutral-11 hidden items-center gap-x-4 rounded-2xl border px-8 py-4 md:flex">
      {NAVBAR_MENU_ITEMS.map((item) => (
        <Link
          href={item.link}
          key={item.title}
          className={cn(
            "text-neutral-7 text-lg font-normal hover:text-blue-50",
            pathname === item.link && "text-xl text-blue-50"
          )}
        >
          {item.title}
        </Link>
      ))}
    </ul>
  );
};
