export type FetchedApplicationType = {
  id: bigint;
  amount: number;
  reason: string;
  hide: boolean;
  rating: number;
  Verifier: {
    id: string;
    distance: number;
    name: string;
    phoneNum: string;
    selfie: string;
  };
} | null;

export type FetchedApplicationsType = FetchedApplicationType[];

export type ApplicationsActionStateAdditionalType = {
  applications: FetchedApplicationsType;
  hasMore: boolean;
};
