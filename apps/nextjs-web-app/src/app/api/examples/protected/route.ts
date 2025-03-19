import { auth } from "@/auth";
import { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const GET: AppRouteHandlerFn = auth(function GET(req) {
  if (req.auth) return NextResponse.json(req.auth, { status: 200 });
  return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
});
