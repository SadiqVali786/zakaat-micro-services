/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { APPLICATIONS_PER_PAGE, TWEETS_PER_PAGE } from "@/config/app.config";
import APP_PATHS from "@/config/path.config";
import prisma from "@/db";
import { ErrorHandler, standardizedApiError } from "@/lib/api-error-success-handlers/error";
import { SuccessResponse } from "@/lib/api-error-success-handlers/success";
import { applicationSchema } from "@/lib/validators/application.validator";
import { idSchema } from "@/lib/validators/global";
import { phoneNumSchema } from "@/lib/validators/search.validators";
import { ROLE, STATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// PUBLIC
export const fetchInfiniteApplicationsFeed = async (previousState: any, payload: Distance) => {
  try {
    console.log(payload);
    // payload = idSchema.parse(payload); // TODO: write Distance Schema
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const rawApplications = (await prisma.$runCommandRaw({
      aggregate: "User",
      pipeline: [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [session.user.longitude, session.user.latitude]
            },
            distanceField: "distance",
            spherical: true,
            key: "location"
          }
        },
        {
          $match: {
            role: "ACCEPTOR"
          }
        },
        {
          $lookup: {
            from: "Application",
            localField: "_id",
            foreignField: "authorId",
            as: "details"
          }
        },
        {
          $addFields: {
            details: {
              $arrayElemAt: ["$details", 0]
            }
          }
        },
        {
          $match: {
            "details.status": "VERIFIED"
          }
        },
        {
          $project: {
            _id: 1,
            fullname: 1,
            phoneNum: 1,
            selfie: 1,
            distance: 1,
            "details._id": 1,
            "details.hide": 1,
            "details.amount": 1,
            "details.reason": 1,
            "details.rating": 1
          }
        },
        ...(payload.distance
          ? [
              {
                $match: {
                  distance: { $gt: Math.ceil(payload.distance) }
                }
              }
            ]
          : [])
      ],
      cursor: {
        batchSize: APPLICATIONS_PER_PAGE + 1
      }
    })) as PaginatedOutput<Application>;

    const applications = rawApplications?.cursor?.firstBatch?.map((app) => ({
      id: app.details?._id,
      amount: app.details?.amount,
      reason: app.details?.reason,
      hide: app.details?.hide,
      rating: app.details?.rating,
      Verifier: {
        id: app._id,
        distance: app.distance,
        fullname: app.fullname,
        phoneNum: app.phoneNum,
        selfie: app.selfie
      }
    }));

    console.log(applications);
    if (applications.length === APPLICATIONS_PER_PAGE + 1) applications.pop();

    return new SuccessResponse("applications feed fetched", 200, {
      applications,
      hasMore: applications.length === APPLICATIONS_PER_PAGE + 1
    }).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

// VERIFIER
export const createApplicationAction = async (
  previousState: any,
  payload: z.infer<typeof applicationSchema>
) => {
  try {
    payload = applicationSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.VERIFIER)
      throw new ErrorHandler(
        "You must be authenticated as VERIFIER to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const applicant = await prisma.user.findUnique({
      where: { phoneNum: payload.phoneNum, role: ROLE.ACCEPTOR }
    });
    if (!applicant) return new ErrorHandler("applicant is not registered", "NOT_FOUND");

    await prisma.application.create({
      data: {
        authorId: applicant.id,
        status: STATUS.VERIFIED,
        verifierUserId: session.user.id,
        amount: payload.amount,
        rating: payload.rating,
        reason: payload.reason,
        hide: payload.hide
      }
    });
    return new SuccessResponse("new zakaat application created successfully", 201).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const editApplicationAction = async (
  previousState: any,
  payload: z.infer<typeof applicationSchema>
) => {
  try {
    payload = applicationSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.VERIFIER)
      throw new ErrorHandler(
        "You must be authenticated as VERIFIER to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const applicant = await prisma.user.findUnique({
      where: { phoneNum: payload.phoneNum, role: ROLE.ACCEPTOR }
    });
    if (!applicant) return new ErrorHandler("applicant is not registered", "NOT_FOUND");

    const resukt = await prisma.application.update({
      where: { authorId: applicant.id },
      data: {
        status: STATUS.VERIFIED,
        verifierUserId: session?.user.id,
        amount: payload.amount,
        rating: payload.rating,
        reason: payload.reason,
        hide: payload.hide
      }
    });
    return new SuccessResponse("zakaat application edited", 201).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const deleteAplicationAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.VERIFIER)
      throw new ErrorHandler(
        "You must be authenticated as VERIFIER to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    await prisma.application.delete({ where: { id: payload.id } });
    return new SuccessResponse("zakaat application deleted", 200).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const searchApplicationByPhoneNum = async (previousState: any, payload: PhoneNum) => {
  payload = phoneNumSchema.parse(payload);
  const session = await auth();
  if (!session || !session.user || session.user.role !== ROLE.VERIFIER)
    throw new ErrorHandler(
      "You must be authenticated as VERIFIER to access this resource",
      "UNAUTHORIZED"
    );
  // #########################################################
  try {
    const foundApplication = await prisma.user.findUnique({
      where: { phoneNum: payload.phoneNum },
      select: {
        fullname: true,
        phoneNum: true,
        selfie: true,
        writtenApplicationId: {
          select: { hide: true, amount: true, reason: true, rating: true }
        }
      }
    });
    if (!foundApplication) {
      throw new ErrorHandler("No Zakaat application with this UPI Phone Number", "BAD_REQUEST");
    }
    const { writtenApplicationId, ...rest } = foundApplication;
    const application = {
      ...rest,
      details: writtenApplicationId
    };
    return new SuccessResponse("application found", 200, application).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

// DONOR
export const donateApplicationAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const application = await prisma.application.update({
      where: { id: payload.id },
      data: {
        status: STATUS.DONATED,
        donatedUserId: session?.user.id,
        bookmarkedUserId: null
      }
    });
    revalidatePath(APP_PATHS.BOOKMARKED_APPLICATIONS);
    revalidatePath(APP_PATHS.DONATIONS_HISTORY);
    return new SuccessResponse("application status changed to DONATED", 200).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const bookmarkApplicationAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    const application = await prisma.application.update({
      where: { id: payload.id },
      data: { status: STATUS.BOOKMARKED, bookmarkedUserId: session?.user.id }
    });
    revalidatePath(APP_PATHS.ZAKAAT_APPLICATIONS);
    revalidatePath(APP_PATHS.BOOKMARKED_APPLICATIONS);
    return new SuccessResponse("application status changed to BOOKMARKED", 200).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const discardApplicationAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  try {
    payload = idSchema.parse(payload);
    const session = await auth();
    if (!session || !session.user || session.user.role !== ROLE.DONOR)
      throw new ErrorHandler(
        "You must be authenticated as DONOR to access this resource",
        "UNAUTHORIZED"
      );
    // #########################################################
    await prisma.application.update({
      where: { id: payload.id },
      data: { status: STATUS.VERIFIED, bookmarkedUserId: null }
    });
    revalidatePath(APP_PATHS.BOOKMARKED_APPLICATIONS);
    revalidatePath(APP_PATHS.ZAKAAT_APPLICATIONS);
    return new SuccessResponse(
      "application status is changed to VERIFIED from BOOKMARKED",
      200
    ).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

type Distance = {
  distance: number;
};

type PaginatedOutput<T> = {
  cursor: {
    firstBatch: T[];
    id: number;
    ns: string;
  };
  ok: number;
  hasMore: boolean;
};

type Application = {
  _id: string;
  fullname: string;
  phoneNum: string;
  selfie: string;
  distance: number;
  details: {
    _id: string;
    hide: boolean;
    amount: number;
    reason: string;
    rating: number;
  };
};

type PhoneNum = {
  phoneNum: string;
};

export const fetchBookmarkedApplicationsFeedAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  payload = idSchema.parse(payload);
  const session = await auth();
  if (!session || !session.user || session.user.role !== ROLE.DONOR)
    throw new ErrorHandler(
      "You must be authenticated as DONOR to access this resource",
      "UNAUTHORIZED"
    );
  // #########################################################
  try {
    const applications = await prisma.application.findMany({
      where: { status: STATUS.BOOKMARKED, bookmarkedUserId: session?.user.id },
      select: {
        id: true,
        hide: true,
        amount: true,
        rating: true,
        reason: true,
        Verifier: {
          select: { id: true, fullname: true, phoneNum: true, selfie: true }
        }
      },
      take: TWEETS_PER_PAGE,
      skip: 1,
      cursor: { id: payload.id },
      orderBy: { createdAt: "desc" }
    });
    return new SuccessResponse(
      "bookmarked applications feed fetched",
      200,
      applications
    ).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const fetchGuestApplicationsFeedAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  payload = idSchema.parse(payload);
  const session = await auth();
  if (!session || !session.user || session.user.role !== ROLE.DONOR)
    throw new ErrorHandler(
      "You must be authenticated as DONOR to access this resource",
      "UNAUTHORIZED"
    );
  // #########################################################
  try {
    const applications = await prisma.application.findMany({
      select: {
        id: true,
        hide: true,
        amount: true,
        rating: true,
        reason: true,
        Verifier: {
          select: { id: true, fullname: true, phoneNum: true, selfie: true }
        }
      },
      take: TWEETS_PER_PAGE,
      skip: 1,
      cursor: { id: payload.id },
      orderBy: { createdAt: "desc" }
    });
    return new SuccessResponse("guest applications feed fetched", 200, applications).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

export const fetchHistoryApplicationsFeedAction = async (
  previousState: any,
  payload: z.infer<typeof idSchema>
) => {
  payload = idSchema.parse(payload);
  const session = await auth();
  if (!session || !session.user || session.user.role !== ROLE.DONOR)
    throw new ErrorHandler(
      "You must be authenticated as DONOR to access this resource",
      "UNAUTHORIZED"
    );
  // #########################################################
  try {
    const applications = await prisma.application.findMany({
      where: { status: STATUS.DONATED, donatedUserId: session?.user.id },
      select: {
        id: true,
        hide: true,
        amount: true,
        rating: true,
        reason: true,
        Verifier: {
          select: { id: true, fullname: true, phoneNum: true, selfie: true }
        }
      },
      take: APPLICATIONS_PER_PAGE,
      skip: 1,
      cursor: { id: payload.id },
      orderBy: { createdAt: "desc" }
    });
    return new SuccessResponse(
      "bookmarked applications feed fetched",
      200,
      applications
    ).serialize();
    // #########################################################
  } catch (error) {
    return standardizedApiError(error);
  }
};

// export const fetchInfiniteApplicationsFeed = async (
//   previousState: any,
//   payload: Distance
// ) => {
//   try {
//     // payload = idSchema.parse(payload);
//     const session = await auth();
//     if (!session || !session.user || session.user.role !== ROLE.DONOR)
//       throw new ErrorHandler(
//         "You must be authenticated as DONOR to access this resource",
//         "UNAUTHORIZED"
//       );
//     // #########################################################
//     const applications = (await prisma.$runCommandRaw({
//       aggregate: "User",
//       pipeline: [
//         {
//           $geoNear: {
//             near: {
//               type: "Point",
//               coordinates: [session.user.longitude, session.user.latitude],
//             },
//             distanceField: "distance",
//             spherical: true,
//             key: "location",
//           },
//         },
//         {
//           $match: {
//             role: "ACCEPTOR",
//           },
//         },
//         {
//           $lookup: {
//             from: "Application",
//             localField: "_id",
//             foreignField: "authorId",
//             as: "details",
//           },
//         },
//         {
//           $addFields: {
//             details: {
//               $arrayElemAt: ["$details", 0],
//             },
//           },
//         },
//         {
//           $match: {
//             "details.status": "VERIFIED",
//           },
//         },
//         {
//           $project: {
//             fullname: 1,
//             phoneNum: 1,
//             selfie: 1,
//             distance: 1,
//             "details._id": 1,
//             "details.hide": 1,
//             "details.amount": 1,
//             "details.reason": 1,
//             "details.rating": 1,
//           },
//         },
//         ...(payload.distance
//           ? [
//               {
//                 $match: {
//                   distance: { $gt: payload.distance + 1 },
//                 },
//               },
//             ]
//           : []),
//       ],
//       cursor: { batchSize: APPLICATIONS_PER_PAGE + 1 },
//     })) as PaginatedOutput<Application>;
//     if (applications.cursor.firstBatch.length === APPLICATIONS_PER_PAGE + 1) {
//       applications.hasMore = true;
//       applications.cursor.firstBatch.pop();
//     } else applications.hasMore = false;
//     return new SuccessResponse(
//       "applications feed fetched",
//       200,
//       applications
//     ).serialize();
//     // #########################################################
//   } catch (error) {
//     return standardizedApiError(error);
//   }
// };
