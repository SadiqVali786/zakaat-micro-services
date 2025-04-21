import { Logger } from "@repo/common/logger";
import { verifyJWT } from "@repo/common/auth-service";
import type { NextFunction, Request, Response } from "express";
import { JOSEError } from "jose/errors";
import { type TokenPayloadType } from "@repo/common/types";
import { NODE_ENV } from "./env";
import { DEVELOPMENT } from "@repo/common/constants";

const logger = new Logger();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    logger.info(`Auth Header: ${authHeader}`);
    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({ msg: "No token provided" });
      return;
    }
    const decoded = (await verifyJWT(token)) as unknown as TokenPayloadType;
    logger.info(`User ${decoded} authenticated`);
    logger.info(`Decoded: ${JSON.stringify(decoded)}`);
    if (!decoded?.id) {
      logger.error("No user ID in the token payload");
      res.status(403).json({ msg: "Invalid token payload" });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Auth Error: ", error);
    if (error instanceof JOSEError) {
      res.status(403).json({
        msg: "Invalid token",
        details: NODE_ENV === DEVELOPMENT ? error.message : undefined,
      });
      return;
    }
    res.status(500).json({
      msg: "Error proceessing authentication",
      details: NODE_ENV === DEVELOPMENT ? (error as Error).message : undefined,
    });
  }
}
