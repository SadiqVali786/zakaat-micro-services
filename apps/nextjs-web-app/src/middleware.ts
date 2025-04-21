import NextAuth from "next-auth";
import authConfig from "@/auth/auth.config";
export const { auth: middleware } = NextAuth(authConfig);

// import { auth } from "@/auth";

// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/signin") {
//     const newUrl = new URL("/signin", req.nextUrl.origin);
//     return Response.redirect(newUrl);
//   }
// });

// export const config = {
//   matcher: [
//     // Match all paths except API routes and public folder
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//     // // Always run for API routes
//     // "/(api|trpc)(.*)"
//   ]
// };
