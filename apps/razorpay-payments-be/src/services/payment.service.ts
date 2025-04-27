import crypto from "crypto";
import { razorpay } from "../config/razorpay.instance";
import { Logger } from "@repo/common/logger";
import { NEXT_PUBLIC_BASE_URL, NODE_ENV, RAZORPAY_WEBHOOK_SECRET } from "../env";
import { prisma } from "@repo/mongodb";

const logger = new Logger();

// Interface for UPI payment link creation
interface UPIPaymentLinkParams {
  amount: number;
  upiId: string;
  donorId: string;
  applicantId: string;
  reference: string;
}

interface PaymentLinkPayload {
  amount: number;
  currency: string;
  accept_partial: boolean;
  description: string;
  reference_id: string;
  callback_url: string;
  callback_method: string;
  customer: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    [key: string]: string;
  };
  options: {
    checkout: {
      name: string;
      prefill?: {
        method: string;
      };
    };
    upi?: {
      vpa: string;
      flow: string;
    };
  };
}

/**
 * Creates a Razorpay payment link for direct UPI transfer
 * This generates a link that donors can use to pay directly to applicant's UPI ID
 */
export const createUPIPaymentLink = async ({
  amount,
  upiId,
  donorId,
  applicantId,
  reference
}: UPIPaymentLinkParams) => {
  try {
    // Create payment link data
    const paymentLinkData: PaymentLinkPayload = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      accept_partial: false,
      description: `Donation to ${upiId}`,
      reference_id: reference,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/razorpay-payment-status`,
      callback_method: "get",
      customer: {
        name: "Donor" // Required field
      },
      notes: {
        donorId,
        applicantId
      },
      options: {
        checkout: {
          name: "Donation Payment",
          prefill: {
            method: "upi"
          }
        },
        upi: {
          vpa: upiId,
          flow: "collect"
        }
      }
    };

    // Create payment link using Razorpay with Promise
    const paymentLink = await new Promise<any>((resolve, reject) => {
      razorpay.paymentLink.create(paymentLinkData, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (NODE_ENV === "development") {
      logger.info("Razorpay payment link created successfully: ", paymentLink);
    }

    // Create transaction record in database
    const transaction = await prisma.razorpayTransaction.create({
      data: {
        referenceId: reference,
        paymentLinkId: paymentLink.id,
        paymentLinkUrl: paymentLink.short_url,
        amount,
        currency: "INR",
        upiId,
        donorId,
        applicantId,
        paymentDescription: `Donation to ${upiId}`,
        status: "PENDING",
        metadata: {
          created_at: new Date(),
          platform: "razorpay",
          payment_type: "upi"
        }
      }
    });

    if (NODE_ENV === "development") {
      logger.info("Transaction record created:", transaction);
    }

    return {
      referenceId: transaction.referenceId,
      paymentLinkId: transaction.paymentLinkId,
      paymentLinkUrl: transaction.paymentLinkUrl,
      amount: transaction.amount,
      currency: transaction.currency,
      upiId: transaction.upiId
    };
  } catch (error) {
    logger.error("Payment link creation failed:", error);
    throw error;
  }
};

/**
 * Verifies the payment status using Razorpay webhook signature
 */
export const verifyPaymentWebhook = async (razorpay_signature: string, webhookBody: string) => {
  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      throw new Error("Razorpay webhook secret not configured");
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest("hex");

    return expectedSignature === razorpay_signature;
  } catch (error) {
    logger.error("Razorpay Webhook verification error", error);
    throw error;
  }
};
