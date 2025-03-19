import z from "zod";

export enum TypesOfMsgs {
  consent = "CONSENT",
  permission = "PERMISSION",
  busy = "BUSY"
}
export enum TypesOfMsgsFromApplicantToServer {
  permission = TypesOfMsgs.permission,
  busy = TypesOfMsgs.busy
}
export enum TypesOfMsgsFromDonorToServer {
  consent = TypesOfMsgs.consent
}
export enum TypesOfMsgsFromServerToApplicant {
  consent = TypesOfMsgs.consent
}
export enum TypesOfMsgsFromServerToDonor {
  permission = TypesOfMsgs.permission,
  busy = TypesOfMsgs.busy
}

export const donorToServerConsentSchema = z.object({
  applicantId: z.string().cuid()
});
export const serverToApplicantConsentSchema = z.object({
  donorId: z.string().cuid(),
  fullname: z.string(),
  avatar: z.string()
});
export const applicantToServerPermissionSchema = z.object({
  donorId: z.string().cuid(),
  applicantPeerId: z.string(),
  status: z.literal(TypesOfMsgsFromApplicantToServer.permission)
});
export const applicantToServerBusySchema = z.object({
  donorId: z.string().cuid(),
  status: z.literal(TypesOfMsgsFromApplicantToServer.busy)
});
export const serverToDonorPermissionSchema = z.object({
  applicantId: z.string().cuid(),
  applicantPeerId: z.string(),
  status: z.literal(TypesOfMsgsFromServerToDonor.permission)
});
export const serverToDonorBusySchema = z.object({
  applicantId: z.string().cuid(),
  fullname: z.string(),
  avatar: z.string(),
  status: z.literal(TypesOfMsgsFromApplicantToServer.busy)
});

export type donorToServerConsentType = {
  type: TypesOfMsgsFromDonorToServer.consent;
  payload: z.infer<typeof donorToServerConsentSchema>;
};
export type serverToApplicantConsentType = {
  type: TypesOfMsgsFromServerToApplicant.consent;
  payload: z.infer<typeof serverToApplicantConsentSchema>;
};
export type applicantToServerBusyType = {
  type: TypesOfMsgsFromApplicantToServer.busy;
  payload: z.infer<typeof applicantToServerBusySchema>;
};
export type applicantToServerPermissionType = {
  type: TypesOfMsgsFromApplicantToServer.permission;
  payload: z.infer<typeof applicantToServerPermissionSchema>;
};
export type serverToDonorPermissionType = {
  type: TypesOfMsgsFromServerToDonor.permission;
  payload: z.infer<typeof serverToDonorPermissionSchema>;
};
export type serverToDonorBusyType = {
  type: TypesOfMsgsFromServerToDonor.busy;
  payload: z.infer<typeof serverToDonorBusySchema>;
};
