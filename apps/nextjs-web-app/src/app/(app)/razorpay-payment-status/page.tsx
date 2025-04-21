"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { APP_PATHS } from "@/config/path.config";
export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("razorpay_payment_link_status");
    const referenceId = searchParams.get("razorpay_payment_link_reference_id");

    if (status === "paid") {
      toast.success("Payment successful!");
    } else {
      toast.error("Payment failed!");
    }

    // // Redirect back to the donation page after 5 seconds
    // setTimeout(() => {
    //   router.push(APP_PATHS.DONOR_DASHBOARD_MESSAGES);
    // }, 5000);
  }, [router, searchParams]);

  const isPaid = searchParams.get("razorpay_payment_link_status") === "paid";

  return (
    <div className="absolute inset-0 mx-auto flex min-h-screen min-w-screen items-center justify-center bg-[#ECEBFE] px-2 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Status Card */}
        <div className="rounded-lg p-8 text-center">
          <div className="mb-6">
            {isPaid ? (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-[#030014]">
            {isPaid ? "Payment Successful!" : "Payment Failed"}
          </h1>

          <p className="mb-6 text-lg text-[#474553]">
            {isPaid
              ? "Thank you for your generous donation. Your contribution will make a real difference."
              : "We encountered an issue processing your payment. Please try again."}
          </p>

          <p className="mb-4 text-sm text-[#474553]">Redirecting back to donations page...</p>

          <button
            onClick={() => router.push(APP_PATHS.DONOR_DASHBOARD_MESSAGES)}
            className="inline-block rounded-md bg-[#4135F3] px-8 py-3 text-xl font-bold text-[#F9EEFE] transition-colors hover:bg-[#A840D9]"
          >
            Return back to Zakaat Dashboard
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#474553]">
          With gratitude, The Zakaat Team
        </div>
      </div>
    </div>
  );
}
