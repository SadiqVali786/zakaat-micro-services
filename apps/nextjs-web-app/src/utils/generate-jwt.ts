import { importJWK, JWTPayload, SignJWT } from "jose";

export const generateJWT = async (payload: JWTPayload) => {
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
