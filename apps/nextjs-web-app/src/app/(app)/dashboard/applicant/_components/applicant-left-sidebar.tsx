import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { CompanyLogo } from "@/app/(landing-page)/_components/navbar/company-logo";
import { UserInfoCard } from "@/components/global/user-info";
import { ApplicantSidebarMenu } from "./applicant-sidebar-menu";

export async function ApplicantLeftSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      side="left"
      className="!bg-brand-dark !hidden w-[5rem] sm:!block lg:w-[19rem]"
    >
      <SidebarContent className="bg-brand-dark border-neutral-11 flex min-h-screen flex-col justify-between rounded-xl border-r-[1px] text-blue-50">
        <SidebarGroup className="flex flex-col gap-y-14">
          <SidebarGroupLabel className="mt-8 text-blue-50">
            <CompanyLogo />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ApplicantSidebarMenu />
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mx-2 mb-8">
          <UserInfoCard />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
