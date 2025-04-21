import { ApplicationStatus } from "@repo/mongodb";

export type ApplicationWithAuthorAndVerifier = {
  id: string;
  amount: number;
  reason: string;
  status: ApplicationStatus;
  hide: boolean;
  rating: number;
  createdAt: Date;
  author: {
    id: string;
    email: string;
    name: string;
    image: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
    selfie: string;
    upiId: string;
  };
  verifier: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
  distance: number;
};
