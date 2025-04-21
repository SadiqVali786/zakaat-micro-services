import { importJWK, JWTPayload, SignJWT } from "jose";
import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, UserRole } from "@repo/mongodb";
import authConfig from "@/auth/auth.config";
import { AUTH_TOKEN_EXPIRATION_TIME } from "@/config/auth.config";
import { UserActivity } from "@repo/common/types";
import { redisQueue } from "@repo/redis";

type ISODateString = string;

declare module "next-auth" {
  interface Session extends DefaultSession {
    exp: number;
    expires: ISODateString;
    jwtToken: string;
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

const generateJWT = async (payload: JWTPayload) => {
  const jwk = await importJWK({
    k: process.env.AUTH_SECRET!,
    alg: "HS256",
    kty: "oct"
  });
  const jwt = await new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    jti: Math.floor(Date.now() / 1000).toString()
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(jwk);
  return jwt;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: AUTH_TOKEN_EXPIRATION_TIME },
  jwt: { maxAge: AUTH_TOKEN_EXPIRATION_TIME },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  events: {
    createUser: async ({ user }) => {
      console.log("###################### NEW USER GOT CREATED #####################");
      if (user && user.email && user.name) {
        redisQueue.lPush(
          process.env.REDIS_MSG_QUEUE_KEY ?? "zakaat",
          JSON.stringify({
            type: UserActivity.OnboardingEmail,
            payload: { donorEmail: user.email, donorName: user.name }
          })
        );
      }
    }
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session, account, profile }) => {
      const newToken = { ...token };
      delete newToken.jti;
      delete newToken.iat;
      if (user) {
        const extractedUser = await prisma.user.findFirst({
          where: { email: user.email ?? "" }
        }); // token.sub === extractedUser.id
        if (!extractedUser) return null;
        return {
          ...newToken,
          role: extractedUser.role,
          jwtToken: await generateJWT({
            name: extractedUser.name,
            email: extractedUser.email,
            image: extractedUser.selfie ?? extractedUser.image,
            id: extractedUser.id,
            role: extractedUser.role,
            exp: newToken.exp,
            iat: newToken.iat
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
        user: { name, email, image: picture, id, role },
        jwtToken
      };
    },
    // Logged in users are authenticated, otherwise redirect to login page
    authorized: async ({ auth }) => !!auth
  }
  // pages: { signIn: "/auth/login", signOut: "/auth/log-out", error: "/auth/error" }
});
