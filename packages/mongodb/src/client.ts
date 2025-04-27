import { PrismaClient } from "../generated/client";
import { NODE_ENV } from "./env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (NODE_ENV === "development") globalForPrisma.prisma = prisma;
