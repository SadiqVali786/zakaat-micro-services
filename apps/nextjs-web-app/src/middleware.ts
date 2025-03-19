import NextAuth, { NextAuthResult } from "next-auth";
import authConfig from "./auth/auth.config";

const { auth } = NextAuth(authConfig);
export const middleware: NextAuthResult["auth"] = auth;

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/public",
//   "/",
//   "/(api|trpc)(.*)"
// ]);

// const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);
// const isDonorRoute = createRouteMatcher(["/dashboard/donor(.*)"]);

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect();
//     // Protect all routes starting with `/dashboard/admin`
//     if (isAdminRoute(request) && (await auth()).sessionClaims?.metadata?.role !== "admin") {
//       const url = new URL("/", request.url);
//       return NextResponse.redirect(url);
//     } else if (isDonorRoute(request) && (await auth()).sessionClaims?.metadata?.role !== "donor") {
//       const url = new URL("/", request.url);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)"
//   ]
// };
