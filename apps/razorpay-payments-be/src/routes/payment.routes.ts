import express, { type Request, type Response } from "express";
import { authMiddleware } from "../middleware";
import { createUPIPaymentLink, verifyPaymentWebhook } from "../services/payment.service";
import { Logger } from "@repo/common/logger";
import { NODE_ENV } from "../env";
import { PaymentStatus, prisma } from "@repo/mongodb";

const logger = new Logger();
const paymentRoutes = express.Router();

// Helper function to map Razorpay status to our PaymentStatus enum
function mapRazorpayStatus(razorpayStatus: string): PaymentStatus {
  switch (razorpayStatus.toLowerCase()) {
    case "success":
      return "COMPLETED";
    case "failed":
      return "FAILED";
    case "created":
    case "initiated":
    case "pending":
      return "PENDING";
    default:
      return "PENDING";
  }
}

// Route to create UPI payment link
paymentRoutes.post("/upi/create-link", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { applicantId, amount, upiId } = req.body;

    logger.info(
      `Creating payment link for applicant ${applicantId} with amount ${amount} and UPI ID ${upiId}`
    );

    if (!upiId || !amount || !applicantId) {
      res.status(400).json({ msg: "Missing required parameters" });
      return;
    }

    const reference = `${Date.now()}_${req.user.id}`;

    const paymentLink = await createUPIPaymentLink({
      amount,
      upiId,
      donorId: req.user.id,
      applicantId,
      reference
    });

    res.status(201).json(paymentLink);
  } catch (error) {
    const ErrorMsg = "Payment link creation error";
    if (NODE_ENV === "development") {
      logger.error(ErrorMsg, error);
    }
    res.status(500).json({
      msg: ErrorMsg,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Webhook route to handle payment status updates
paymentRoutes.post("/razorpay/webhook", async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      res.status(400).json({ msg: "Missing signature" });
      return;
    }

    // For webhook, the raw body is the webhook body
    const webhookBody = req.body.toString();
    const isValid = await verifyPaymentWebhook(signature, webhookBody);
    if (!isValid) {
      res.status(400).json({ msg: "Invalid signature" });
      return;
    }

    // Parse the webhook body
    const event = JSON.parse(webhookBody);
    const paymentLinkId = event?.payload?.payment_link?.entity?.id;

    if (paymentLinkId) {
      const razorpayStatus = event?.payload?.payment_link?.entity?.status;
      const status = mapRazorpayStatus(razorpayStatus);

      await prisma.razorpayTransaction.updateMany({
        where: { paymentLinkId },
        data: {
          status,
          updatedAt: new Date()
        }
      });
    }

    res.json({ status: "ok" });
  } catch (error) {
    logger.error("Webhook processing failed:", error);
    res.status(500).json({ msg: "Webhook processing failed" });
  }
});

// paymentRoutes.get(
//   "/status/:referenceId",
//   async (req: Request, res: Response) => {
//     try {
//       const { referenceId } = req.params;

//       const transaction = await prisma.razorpayTransaction.findUnique({
//         where: { referenceId: referenceId },
//       });

//       if (!transaction) {
//         res.status(404).json({ msg: "Transaction not found" });
//         return;
//       }

//       // Fetch latest payment status from Razorpay
//       const paymentLink = await new Promise<any>((resolve, reject) => {
//         razorpay.paymentLink.fetch(transaction.paymentLinkId, (err, data) => {
//           if (err) reject(err);
//           resolve(data);
//         });
//       });

//       // Map Razorpay status to our PaymentStatus enum
//       const status = mapRazorpayStatus(paymentLink.status);

//       // Update transaction status if needed
//       if (status !== transaction.status) {
//         await prisma.razorpayTransaction.update({
//           where: { id: transaction.id },
//           data: {
//             status,
//             updatedAt: new Date(),
//           },
//         });
//       }

//       res.json({
//         status,
//         amount: transaction.amount,
//         currency: transaction.currency,
//         referenceId: transaction.referenceId,
//       });
//     } catch (error) {
//       const errorMsg = "Failed to fetch payment status";
//       logger.error(errorMsg, error);
//       res.status(500).json({
//         msg: errorMsg,
//         details: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }
// );

export { paymentRoutes };
