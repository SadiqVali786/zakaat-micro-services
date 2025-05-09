import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ApplicantLeftSidebar } from "./_components/applicant-left-sidebar";
import { EmptyRightSidebar } from "../_components/empty-right-sidebar";
import { ApplicantMobileMenubar } from "./_components/applicant-mobile-menubar";
import { Feedbar } from "@/components/global/feed-bar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="relative mx-auto sm:px-4">
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="relative">
          <div className="sticky top-0 left-0 z-10">
            <ApplicantLeftSidebar />
          </div>
        </div>
        <main className="border-neutral-11 flex w-full max-w-[52rem] flex-1 flex-col gap-y-4 border-x-[1px]">
          <Feedbar />
          {children}
        </main>
        <div className="relative">
          <div className="sticky top-0 left-0 z-10">
            <EmptyRightSidebar />
          </div>
        </div>
        <ApplicantMobileMenubar />
      </SidebarProvider>
    </div>
  );
}
