"use client";

import React, { useState, useCallback, useEffect } from "react";
import { razorpayApi } from "@/app/api/payment/razorpay";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface PaymentButtonProps {
  applicantId: string;
  applicantName: string;
  upiId: string;
  amount: number;
  onSuccess?: (referenceId: string) => void;
  onError?: (error: Error) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  applicantId,
  applicantName,
  upiId,
  amount,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handlePayment = useCallback(async () => {
    try {
      if (status !== "authenticated") return;
      setLoading(true);
      toast.loading("Creating payment link...");

      const paymentLink = await razorpayApi.createPaymentLink(
        {
          applicantId,
          amount,
          upiId
        },
        session?.jwtToken || ""
      );

      toast.dismiss();
      toast.success("Payment link created successfully!");

      // Store reference ID for status checking
      localStorage.setItem("lastPaymentReference", paymentLink.reference_id);

      // Open payment link in new window
      window.open(paymentLink.payment_link_url, "_blank");

      // Pass the reference ID to the success callback
      onSuccess?.(paymentLink.reference_id);
    } catch (error) {
      toast.dismiss();
      toast.error((error as Error)?.message || "Payment link creation failed");
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  }, [applicantId, amount, onError, onSuccess, session?.jwtToken, upiId, status]);

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <span>Processing...</span> : <span>Pay ₹{amount}</span>}
    </button>
  );
};
