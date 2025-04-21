"use client";

import { BookmarkApplication, UnbookmarkApplication } from "@/actions/application.action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { initiateVideoCall } from "@/lib/call-service";
import { useSession } from "next-auth/react";
import { useChatStore } from "@repo/zustand/src/chat-store";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@/config/path.config";
import { createRoom } from "@/actions/message.actions";
import { DifferentRoomMessages } from "@repo/common/types";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { razorpayApi } from "@/app/api/payment/razorpay";

type Props = {
  isItBookmark: boolean;
  applicantId: string;
  applicantName: string;
  applicantImage: string;
  amount: number;
  upiId: string;
};

type PaymentLinkResponse = {
  amount: number;
  currency: string;
  paymentLinkId: string;
  paymentLinkUrl: string;
  referenceId: string;
  upiId: string;
};
export const CustomDropdownMenuItems = ({
  isItBookmark,
  applicantId,
  applicantName,
  applicantImage,
  amount,
  upiId
}: Props) => {
  const state = useChatStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  const handlePayment = useCallback(async () => {
    try {
      if (status !== "authenticated") return;
      setLoading(true);
      toast.loading("Creating payment link...");

      const paymentLink = (await razorpayApi.createPaymentLink(
        {
          applicantId,
          amount,
          upiId
        },
        session?.jwtToken || ""
      )) as unknown as PaymentLinkResponse;

      toast.dismiss();
      toast.success("Payment link created successfully!");

      // Store reference ID for status checking
      localStorage.setItem("lastPaymentReference", paymentLink.paymentLinkUrl);

      // Open payment link in new window
      window.open(paymentLink.paymentLinkUrl, "_blank");
    } catch (error) {
      toast.dismiss();
      toast.error((error as Error)?.message || "Payment link creation failed");
    } finally {
      setLoading(false);
    }
  }, [applicantId, amount, session?.jwtToken, upiId, status]);

  if (!session) return null;

  return (
    <>
      <DropdownMenuItem className="hover:!bg-brand-dark" onClick={handlePayment}>
        Donate
      </DropdownMenuItem>
      <DropdownMenuItem
        className="hover:!bg-brand-dark"
        onClick={() => {
          initiateVideoCall(
            applicantId,
            applicantName,
            applicantImage,
            session.user.id,
            session.user.name,
            session.user.image
          );
          router.push(APP_PATHS.DONOR_DASHBOARD_VIDEO_CALL);
        }}
      >
        Video Call
      </DropdownMenuItem>
      <DropdownMenuItem
        className="hover:!bg-brand-dark"
        onClick={async () => {
          const room = state.rooms.find((room) => room.participant.id === applicantId);
          if (room) {
            router.push(`${APP_PATHS.DONOR_DASHBOARD_MESSAGES}/${room.roomId}`);
          } else {
            const newRoom = await createRoom(session.user.id, applicantId);
            console.log("newRoom", { newRoom });
            state.addRoom(newRoom[0]);
            console.log("newRoom", { newRoom });
            state.ws?.send(
              JSON.stringify({
                type: DifferentRoomMessages.CreateRoom,
                payload: {
                  roomId: newRoom[0].roomId,
                  applicantId,
                  donorId: session.user.id,
                  donorName: session.user.name,
                  donorImage: session.user.image
                }
              })
            );
            router.push(`${APP_PATHS.DONOR_DASHBOARD_MESSAGES}/${newRoom[0].roomId}`);
          }
        }}
      >
        Chat
      </DropdownMenuItem>
      <DropdownMenuItem
        className="hover:!bg-brand-dark"
        onClick={() =>
          isItBookmark ? UnbookmarkApplication(applicantId) : BookmarkApplication(applicantId)
        }
      >
        {isItBookmark ? "Unbookmark" : "Bookmark"}
      </DropdownMenuItem>
    </>
  );
};
