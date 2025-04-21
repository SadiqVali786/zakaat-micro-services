import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForwardRefExoticComponent } from "react";
import { LucideProps } from "lucide-react";
import { RefAttributes } from "react";
import Link from "next/link";

type MenubarItemProps = {
  value: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  url: string;
};

const MenubarItem = ({ value, Icon, title, url }: MenubarItemProps) => {
  return (
    <TabsTrigger value={value} className="flex flex-col items-center gap-1 p-2" asChild>
      <Link href={url}>
        <Icon className="!h-6 !w-6" />
        <span className="text-xs">{title}</span>
      </Link>
    </TabsTrigger>
  );
};

export const MobileMenubar = ({
  defaultValue,
  MenubarItemList
}: {
  defaultValue: string;
  MenubarItemList: MenubarItemProps[];
}) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className="fixed right-0 bottom-0 left-0 z-50 w-full sm:hidden"
    >
      <TabsList className="bg-brand-dark !border-neutral-11 flex h-16 w-full items-center justify-between border-t-[1px]">
        {MenubarItemList.map((item) => (
          <MenubarItem key={item.value} {...item} />
        ))}
      </TabsList>
    </Tabs>
  );
};
