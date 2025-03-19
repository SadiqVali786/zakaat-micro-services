import { verifyJWT } from "@repo/common/verify-jwt";
import type { NextFunction, Request, Response } from "express";
import { JOSEError } from "jose/errors";

export enum UserRole {
  Admin = "Admin",
  Verifier = "Verifier",
  Donor = "Donor",
  Applicant = "Applicant"
}

export type TokenPayloadType = {
  role: UserRole;
  sub: string;
  name: string;
  email: string;
  picture: string;
  exp: number;
};

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({ msg: "No token provided" });
      return;
    }
    const decoded = (await verifyJWT(token)) as unknown as TokenPayloadType;
    console.log(decoded);
    if (!decoded?.sub) {
      console.error("No user ID in the token payload");
      res.status(403).json({ msg: "Invalid token payload" });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Error: ", error);
    if (error instanceof JOSEError) {
      res.status(403).json({
        msg: "Invalid token",
        details: process.env.NODE_ENV == "development" ? error.message : undefined
      });
      return;
    }
    res.status(500).json({
      msg: "Error proceessing authentication",
      details: process.env.NODE_ENV == "development" ? (error as Error).message : undefined
    });
  }
}
