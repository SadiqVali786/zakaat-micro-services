import NextAuth from "next-auth";
import authConfig from "@/auth/auth.config";
export const { auth: middleware } = NextAuth(authConfig);

// import NextAuth from "next-auth";
// import authConfig from "@/auth/auth.config";
// import { UserRole } from "@repo/common/types";
// import { APP_PATHS } from "./config/path.config";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import type { Session } from "next-auth";

// const { auth } = NextAuth(authConfig);

// interface AuthRequest extends NextRequest {
//   auth?: Session | null;
// }

// // Helper function to create redirect response
// const createRedirectResponse = (url: string, origin: string) => {
//   const newUrl = new URL(url, origin);
//   return Response.redirect(newUrl);
// };

// // Helper function to get role-specific dashboard path
// const getRoleDashboardPath = (role: UserRole): string => {
//   if (role === UserRole.Applicant) {
//     return APP_PATHS.APPLICANT_DASHBOARD_MESSAGES;
//   } else if (role === UserRole.Donor) {
//     return APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS;
//   } else if (role === UserRole.Verifier) {
//     return APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT;
//   } else {
//     return APP_PATHS.SIGNIN;
//   }
// };

// export default auth((req: AuthRequest) => {
//   if (req.nextUrl.pathname.includes("dashboard")) {
//     if (req.auth?.user && req.nextUrl.pathname.includes(req.auth.user.role.toLowerCase())) {
//       return NextResponse.next();
//     } else if (req.auth?.user) {
//       return createRedirectResponse(getRoleDashboardPath(req.auth.user.role), req.nextUrl.origin);
//     } else {
//       return createRedirectResponse(APP_PATHS.SIGNIN, req.nextUrl.origin);
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Match all paths except static files and API routes
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)"
//   ]
// };
