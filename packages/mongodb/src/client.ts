import { PrismaClient } from "../generated/client";
import { NODE_ENV } from "./env";
import { DEVELOPMENT } from "@repo/common/constants";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (NODE_ENV === DEVELOPMENT) globalForPrisma.prisma = prisma;
