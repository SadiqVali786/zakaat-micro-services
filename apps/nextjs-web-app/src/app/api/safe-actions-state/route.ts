import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  const authenticated = !!session && !!session?.user;
  return NextResponse.json({ authenticated, role: session?.user?.role });
};
