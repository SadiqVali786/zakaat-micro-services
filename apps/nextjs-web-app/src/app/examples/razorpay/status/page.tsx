"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

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

    // Redirect back to the donation page after 5 seconds
    setTimeout(() => {
      router.push("/examples/razorpay");
    }, 5000);
  }, [router, searchParams]);

  const isPaid = searchParams.get("razorpay_payment_link_status") === "paid";

  return (
    <div className="min-h-screen bg-[#ECEBFE] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Image
            src="https://res.cloudinary.com/dud648ixu/image/upload/v1744893907/big-logo_pt35dl.png"
            width={80}
            height={80}
            alt="Zakaat"
            className="mx-auto"
          />
        </div>

        {/* Status Card */}
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
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

          <div className="mb-4 text-sm text-[#474553]">Redirecting back to donations page...</div>

          <button
            onClick={() => router.push("/examples/razorpay")}
            className="inline-block rounded-md bg-[#BE52F2] px-8 py-3 text-xl font-bold text-[#F9EEFE] transition-colors hover:bg-[#A840D9]"
          >
            Return to Donations
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
