export const dynamic = "force-dynamic";

import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const auth = await onAuthenticateUser();
  if (auth.status === 500 || auth.status === 403 || auth.status === 400) redirect("/sign-in");

  return <div className="w-full">{children}</div>;
};

export default Layout;
