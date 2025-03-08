import { getRecentProjects } from "@/actions/project";
import { onAuthenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/app-sidebar";
import UpperInfobar from "@/components/global/upper-infobar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const recentProjects = await getRecentProjects();
  const auth = await onAuthenticateUser();
  if (auth.status === 500 || auth.status === 403 || auth.status === 400 || !auth.user)
    redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar recentProjects={recentProjects.data || []} user={auth.user!} />
      <SidebarInset>
        <UpperInfobar user={auth?.user} />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
