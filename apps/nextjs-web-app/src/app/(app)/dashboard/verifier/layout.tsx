import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { VerifierLeftSidebar } from "./_components/verifier-left-sidebar";
import { EmptyRightSidebar } from "../_components/empty-right-sidebar";
import { VerifierMobileMenubar } from "./_components/verifier-mobile-menubar";
import { Feedbar } from "@/components/global/feed-bar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="relative mx-auto sm:px-4">
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="relative">
          <div className="sticky top-0 left-0 z-10">
            <VerifierLeftSidebar />
          </div>
        </div>
        <main className="border-neutral-11 flex w-full max-w-[52rem] flex-1 flex-col gap-y-4 border-x-[1px]">
          <Feedbar />
          {children}
        </main>
        <div className="relative">
          <div className="sticky top-0 right-0 z-10">
            <EmptyRightSidebar />
          </div>
        </div>
        <VerifierMobileMenubar />
      </SidebarProvider>
    </div>
  );
}
