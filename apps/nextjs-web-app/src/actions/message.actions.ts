"use server";

import { auth } from "@/auth";
import { DifferentMessageStatus } from "@repo/common/types";
import { MessageStatus, prisma, UserRole } from "@repo/mongodb";

export async function createRoom(donorId: string, applicantId: string) {
  const session = await auth();
  if (!session || session.user.id !== donorId) {
    return [];
  }

  const applicant = await prisma.user.findUnique({
    where: { id: applicantId },
    select: {
      name: true,
      selfie: true,
      image: true,
      isOnline: true
    }
  });

  if (!applicant?.name) {
    return [];
  }

  const room = await prisma.room.create({
    data: { participantIds: [donorId, applicantId] }
  });

  // revalidatePath(`/dashboard/donor/messages`);
  return [
    {
      roomId: room.id,
      roomName: applicant.name,
      image: applicant.selfie ?? applicant.image,
      unreadMessages: 0,
      messages: [],
      participant: {
        id: applicantId,
        isOnline: applicant.isOnline,
        isTyping: false
      }
    }
  ];
}

export async function getRooms() {
  const session = await auth();
  if (!session) return [];

  const rawRooms = await prisma.room.findMany({
    where: {
      participantIds: { has: session.user.id }
    },
    select: {
      id: true,
      chats: {
        orderBy: { sentAt: "desc" },
        select: { content: true, sentAt: true, status: true, senderId: true, id: true },
        take: 1
      },
      participants: {
        where: {
          role: session.user.role === UserRole.APPLICANT ? UserRole.DONOR : UserRole.APPLICANT
        },
        select: { id: true, name: true, image: true, selfie: true, isOnline: true }
      },
      _count: {
        select: {
          chats: { where: { status: MessageStatus.RECEIVED } }
        }
      }
    }
  });

  const rooms = rawRooms.map((room) => ({
    roomId: room.id,
    roomName: room.participants[0]?.name ?? "",
    image: room.participants[0]?.selfie ?? room.participants[0]?.image ?? "",
    unreadMessages: room._count.chats,
    messages: room.chats.map((chat) => ({
      ...chat,
      status: chat.status as DifferentMessageStatus
    })),
    participant: {
      id: room.participants[0]?.id ?? "",
      isOnline: room.participants[0]?.isOnline || false,
      isTyping: false
    }
  }));

  return rooms;
}

export async function getMessagesOfRoom(roomId: string) {
  const session = await auth();
  if (!session) return [];

  const messages = await prisma.message.findMany({
    where: { roomId },
    select: { id: true, content: true, sentAt: true, status: true, senderId: true }
  });

  return messages.map((message) => ({
    ...message,
    status: message.status as DifferentMessageStatus
  }));
}

export async function getRoomIds() {
  const session = await auth();
  if (!session) return [];

  const rooms = await prisma.room.findMany({
    where: { participantIds: { has: session?.user.id } },
    select: { id: true }
  });

  const result = rooms.map((room) => room.id);
  return result;
}
