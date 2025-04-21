import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu
} from "@/components/ui/sidebar";
import { CustomSearchbar } from "./custom-searchbar";
import { UserInfoCard } from "@/components/global/user-info";

export function DonorRightSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      side="right"
      className="!bg-brand-dark !hidden w-[19rem] xl:!block"
    >
      <SidebarContent className="bg-brand-dark flex min-h-screen flex-col justify-between text-blue-50">
        <SidebarGroup className="flex flex-col gap-y-14">
          <SidebarGroupContent>
            {/* render donors to subscribe to */}
            <SidebarMenu>
              <CustomSearchbar />
              <div className="flex flex-col gap-y-5">
                <p className="text-lg text-blue-50">Who to follow?</p>
                <UserInfoCard rank="100" className="cursor-not-allowed" />
                <UserInfoCard rank="1" className="cursor-not-allowed" />
                <UserInfoCard rank="10" className="cursor-not-allowed" />
                <p className="text-neutral-7 cursor-pointer text-lg">Show More</p>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
