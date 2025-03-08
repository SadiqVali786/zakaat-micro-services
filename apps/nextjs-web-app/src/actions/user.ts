"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/mongodb/client";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user || !user?.emailAddresses[0]?.emailAddress) return { status: 403 };
    const extractedUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
      // include: { PurchasedProjects: { select: { id: true } } }
    });
    if (extractedUser) return { status: 200, user: extractedUser };
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        profileImage: user.imageUrl
      }
    });
    if (newUser) return { status: 201, user: newUser };
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR : ", error);
    return { status: 500, error: "Internal Server Error" };
  }
};
