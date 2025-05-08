/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { applySchema } from "@/app/(app)/dashboard/verifier/apply/_schema/validation";
import { auth } from "@/auth";
import { APP_PATHS } from "@/config/path.config";
import { APPLICATIONS_PER_PAGE } from "@/config/server-actions.config";
import { uploadFile } from "@/lib/upload-file";
import { ApplicationWithAuthorAndVerifier } from "@/types/fetch-application-action.type";
import { ApplicationStatus, UserRole } from "@repo/common/types";
import { prisma } from "@repo/mongodb";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "safe-actions-state";
import { z } from "zod";

// ############################################
// ########## DONOR SPECIFIC ACTIONS ##########
// ############################################
// Fetch Applications given longitude?, latitude?, page
// db.users.createIndex({ location: "2dsphere" })
const fetchApplicationsSchema = z.object({
  longitude: z.string().min(1),
  latitude: z.string().min(1),
  page: z.number().min(1)
});

export const fetchApplicationsHandler = async (args?: z.infer<typeof fetchApplicationsSchema>) => {
  const geoNearPipeline = await prisma.$runCommandRaw({
    aggregate: "User",
    pipeline: [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(args!.longitude!), parseFloat(args!.latitude!)]
          },
          distanceField: "distance",
          spherical: true,
          query: { role: UserRole.Applicant },
          key: "location",
          distanceMultiplier: 0.001,
          minDistance: 0,
          maxDistance: 10000000 // 1000 km in meters TODO: transfer it to config later
        }
      },
      {
        $lookup: {
          from: "Application",
          localField: "_id",
          foreignField: "authorId",
          as: "application"
        }
      },
      { $unwind: { path: "$application", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "User",
          localField: "application.verifierUserId",
          foreignField: "_id",
          as: "verifier"
        }
      },
      { $unwind: { path: "$verifier", preserveNullAndEmptyArrays: false } },
      // { $match: { "application.status": ApplicationStatus.Verified } }, // TODO: Uncomment this when we have a verified applications page
      { $skip: (args!.page! - 1) * APPLICATIONS_PER_PAGE },
      { $limit: APPLICATIONS_PER_PAGE }
    ],
    cursor: {}
  });
  if ((geoNearPipeline as any).cursor.firstBatch.length === 0)
    return { error: "No applications found" };
  const result = (geoNearPipeline.cursor as any).firstBatch.map((item: any) => ({
    id: item.application._id.$oid,
    amount: item.application.amount,
    reason: item.application.reason,
    hide: item.application.hide,
    rating: item.application.rating,
    createdAt: item.application.createdAt?.$date,
    author: {
      id: item._id.$oid,
      email: item.email,
      name: item.name,
      image: item.image,
      location: item.location,
      selfie: item.selfie,
      upiId: item.upiId
    },
    verifier: {
      id: item.verifier._id.$oid,
      name: item.verifier.name,
      image: item.verifier.image,
      email: item.verifier.email
    },
    distance: item.distance
  })) as ApplicationWithAuthorAndVerifier[];
  return { data: result };
};

export const SafeServerAction = createSafeAction({
  action: {
    withInputs: true,
    handler: fetchApplicationsHandler,
    schema: fetchApplicationsSchema
  },
  actionType: {
    allowedRoles: [UserRole.Donor],
    isPrivate: true
  }
});

// Fetch Bookmarked Applications
export const FetchBookmarkedApplications = async () => {
  const session = await auth();
  if (!session?.user) {
    return [];
  }
  const bookmarkedApplications = await prisma.application.findMany({
    where: { bookmarkedUserId: session.user.id },
    select: {
      id: true,
      amount: true,
      reason: true,
      hide: true,
      rating: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          location: true,
          selfie: true
        }
      },
      verifier: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true
        }
      }
    }
  });
  return bookmarkedApplications;
};

// Fetch Donated Applications
export const FetctDonatedApplications = async () => {
  const session = await auth();
  if (!session?.user) {
    return [];
  }
  const donatedApplications = await prisma.application.findMany({
    where: { donorUserId: session.user.id },
    select: {
      id: true,
      amount: true,
      reason: true,
      hide: true,
      rating: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          location: true,
          selfie: true
        }
      },
      verifier: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true
        }
      }
    }
  });
  return donatedApplications;
};

// Bookmark Application given application id
export const BookmarkApplication = async (applicationId: string) => {
  const session = await auth();
  if (!session?.user) return null;
  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { bookmarkedUserId: session.user.id, status: ApplicationStatus.Bookmarked }
  });
  revalidatePath(APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS);
  // return application;
};

// Unbookmark Application given application id
export const UnbookmarkApplication = async (applicationId: string) => {
  const session = await auth();
  if (!session?.user) return null;
  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { bookmarkedUserId: null, status: ApplicationStatus.Verified }
  });
  revalidatePath(APP_PATHS.DONOR_DASHBOARD_BOOKMARKED_APPLICATIONS);
  // return application;
};

// FUTURE: Donate Application given application id, razorpay payment id, amount, etc

// ############################################
// ########## VERIFIER SPECIFIC ACTIONS #######
// ############################################
// Create Application given applicantId, etc
export const CreateApplication = async (application: z.infer<typeof applySchema>) => {
  const session = await auth();
  if (!session?.user) return null;

  await prisma.$transaction(async (tx: any) => {
    const author = await tx.user.update({
      where: { email: application.email },
      data: {
        upiId: application.upiId,
        selfie: application.selfie,
        location: {
          type: "Point",
          coordinates: [application.longitude, application.latitude]
        },
        faceEmbedding: application.encodedFace
      }
    });
    if (!author) throw new Error("Author not found");
    await tx.application.create({
      data: {
        authorId: author.id,
        amount: application.amount,
        reason: application.reason,
        rating: application.rank,
        verifierUserId: session.user.id,
        hide: !application.selfie
      }
    });
  });
};

// FUTURE: Search Application given selfie (face verification)

// // Search Application given UPI id
// export const SearchApplicationByUPI = async (upiId: string) => {
//   const session = await auth();
//   if (!session?.user) return null;
//   const applicant = await prisma.user.findFirst({
//     // TODO: Need to change the user schema to accommodate upiId
//     where: { upiId },
//     select: {
//       id: true,
//       writtenApplicationId: true
//     }
//   });
//   return applicant;
// };

// ############################################
// ########## APPLICANT SPECIFIC ACTIONS ######
// ############################################
// Fetch My Application
export const FetchMyApplication = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const application = await prisma.application.findUnique({
    where: { authorId: session.user.id }
  });
  return application;
};

export type SimilarFacesResponse = {
  success: boolean;
  data?: { similarFaces: string[]; faceEmbedding: number[] };
  error?: string;
};

type EncodedFaceResponse = {
  status?: "success";
  embedding?: number[];
  status_code?: number;
  detail?: string;
};

export const findSimilarFaces = async (selfie: FormData): Promise<SimilarFacesResponse> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_FASTAPI_FACE_VERIFICATION_BE_URL}/encode_face`;
    const response = await fetch(url, { method: "POST", body: selfie });
    const result = (await response.json()) as EncodedFaceResponse;

    console.log("EncodedFaceResponse : ", result);

    if (result?.status === "success") {
      // console.log(result);
      const faceEmbedding = result.embedding!;

      // Validate input
      if (!Array.isArray(faceEmbedding) || faceEmbedding.length !== 512) {
        return {
          success: false,
          error: "Invalid face embedding. Must be an array of 512 numbers."
        };
      }

      // Use MongoDB's aggregation pipeline with vector search
      const response = await prisma.$runCommandRaw({
        aggregate: "User",
        pipeline: [
          {
            $vectorSearch: {
              index: "User_faceEmbedding", // MongoDB automatically names the index
              path: "faceEmbedding",
              queryVector: faceEmbedding,
              numCandidates: 5000,
              limit: 4
            }
          },
          { $project: { selfie: 1 } }
        ],
        cursor: {}
      });

      console.log("RESULT", (response as any).cursor?.firstBatch);

      const formattedResult = ((response as any).cursor?.firstBatch || []).map(
        (item: any) => item.selfie
      );

      return {
        success: true,
        data: { similarFaces: formattedResult ? formattedResult : [], faceEmbedding }
      };
    } else {
      return {
        success: false,
        error: result?.detail || "Failed to find similar faces"
      };
    }
  } catch (error) {
    console.error("Error in findSimilarFaces:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find similar faces"
    };
  }
};
