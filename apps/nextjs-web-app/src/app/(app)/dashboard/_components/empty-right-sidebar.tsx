import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent
} from "@/components/ui/sidebar";

export function EmptyRightSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      side="right"
      className="!bg-brand-dark !hidden w-[19rem] xl:!block"
    >
      <SidebarContent className="bg-brand-dark border-neutral-11 flex flex-col justify-between rounded-xl border-l-[1px] text-blue-50">
        <SidebarGroup className="flex flex-col gap-y-14">
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
