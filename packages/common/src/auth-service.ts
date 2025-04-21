import { IncomingMessage } from "http";
import { type JWTPayload, importJWK, jwtVerify } from "jose";
import { JOSEError } from "jose/errors";
import { Logger } from "./logger";
import type { Client, UserRole } from "./types";
import { AUTH_SECRET } from "./env";
const logger = new Logger();

export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  try {
    const jwk = await importJWK({
      k: AUTH_SECRET,
      alg: "HS256",
      kty: "oct",
    });
    const { payload } = await jwtVerify(token, jwk);
    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const authenticate = async (
  request: IncomingMessage,
  next: (err: Error | null, client: Client | null) => void
) => {
  const url = request.url;
  logger.info("Recieved URL: ", url);
  if (!url) return;
  const urlParts = url.split("?");
  if (urlParts.length < 2) return; // No query parameters
  // @ts-ignore
  const queryParams = new URLSearchParams(urlParts[1]);
  const token = queryParams.get("token") || "";
  if (!token) {
    logger.error("Token is required");
    next(new Error("Token is required"), null);
    return;
  }
  logger.info("Recieved Token: ", token);
  // TODO: make a DB call to verify the token validity. and also expiry time
  try {
    const decoded = (await verifyJWT(token)) as JWTPayload;
    logger.info("Decoded data from the token = ", decoded);
    if (decoded?.id) {
      const client: Client = {
        userId: decoded.id as string,
        role: decoded.role as UserRole,
        email: decoded.email as string,
        image: decoded.image as string,
        name: decoded.name as string,
      };
      next(null, client);
    }
  } catch (error) {
    if (error instanceof JOSEError) {
      next(new Error("Token expired"), null);
    }
    logger.error("Error authenticating user:", error);
    next(new Error("Unauthorized"), null);
  }
};
