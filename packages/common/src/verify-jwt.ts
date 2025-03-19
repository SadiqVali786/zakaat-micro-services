import { importJWK, JWTPayload, jwtVerify } from "jose";

export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  const secret = process.env.AUTH_SECRET;
  try {
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const { payload } = await jwtVerify(token, jwk);
    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
