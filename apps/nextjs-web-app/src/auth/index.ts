/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { DefaultSession, type NextAuthResult } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, UserRole } from "@repo/mongodb";
import { AUTH_TOKEN_EXPIRATION_TIME } from "@/config/auth.config";
import { generateJWT } from "@/utils/generate-jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    exp: number;
    expires: Date & string;
    jwtToken: string;
    user: {
      id: string;
      email: string;
      picture: string;
      name: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

const result = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt", maxAge: AUTH_TOKEN_EXPIRATION_TIME },
  jwt: { maxAge: AUTH_TOKEN_EXPIRATION_TIME },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  callbacks: {
    jwt: async ({ token, user, trigger, session, account, profile }) => {
      const newToken = { ...token };
      delete newToken.jti;
      delete newToken.iat;
      if (user) {
        const extractedUser = await prisma.user.findFirst({
          where: { email: user.email }
        }); // token.sub === extractedUser.id
        if (!extractedUser) return null;
        return {
          ...newToken,
          role: extractedUser.role,
          // role, name, email, picture, sub, exp
          jwtToken: await generateJWT({
            ...newToken,
            role: extractedUser.role
          })
        };
      }
      return newToken;
    },
    session: ({ session, token, user, trigger, newSession }) => {
      const { expires, sessionToken } = session;
      const { name, email, picture, sub: id, role, exp, jwtToken } = token;
      return {
        exp,
        expires,
        sessionToken,
        user: { name, email, picture, id, role },
        jwtToken
      };
    },
    // Logged in users are authenticated, otherwise redirect to login page
    authorized: async ({ auth }) => !!auth
  }
  // pages: { signIn: "/auth/login", signOut: "/auth/log-out", error: "/auth/error" }
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
