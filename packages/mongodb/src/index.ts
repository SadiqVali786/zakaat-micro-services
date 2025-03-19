export { prisma } from "./client"; // exports instance of prisma
export * from "../generated/client"; // exports generated types from prisma

export enum UserRole {
  Admin = "Admin",
  Verifier = "Verifier",
  Donor = "Donor",
  Applicant = "Applicant"
}
