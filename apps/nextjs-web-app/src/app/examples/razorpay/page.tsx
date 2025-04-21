"use client";

import React, { useState } from "react";
import { PaymentButton } from "@/app/examples/razorpay/_components/button";

interface DonationPageProps {
  params: {
    id: string;
  };
}

export default function DonatePage({ params }: DonationPageProps) {
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  // This would typically come from your API/database
  const applicantData = {
    id: params.id || "67fa13742b107bac2a089404",
    name: "John Doe",
    upiId: "john.doe@upi"
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Donate to {applicantData.name}</h1>

      <div className="space-y-6">
        {/* Donation amount options */}
        <div className="grid grid-cols-3 gap-4">
          {[100, 500, 1000].map((amount) => (
            <PaymentButton
              key={amount}
              applicantId={applicantData.id}
              applicantName={applicantData.name}
              upiId={applicantData.upiId}
              amount={amount}
              onSuccess={(referenceId) => {
                setPaymentReference(referenceId);
              }}
              onError={(error) => {
                console.error("Payment failed:", error);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
