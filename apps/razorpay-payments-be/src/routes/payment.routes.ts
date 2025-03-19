import express, { type Request, type Response } from "express";

import { authMiddleware } from "../middleware";
import { createRazorpayOrder, verifyPaymentSignature } from "../services/payment.service";

const paymentRoutes = express.Router();

paymentRoutes.post("/razorpay/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { applicantId, amount } = req.body;
    // TODO: do zod validations

    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV key not configured");
    }

    try {
      const order = await createRazorpayOrder(amount, req.user.sub, applicantId);
      res.status(201).json(order);
      return;
    } catch (error) {
      const ErrorMsg = "Razorpay Payment order creation error";
      console.error(ErrorMsg, error);
      res.status(500).json({
        msg: ErrorMsg,
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      });
    }
  } catch (error) {
    console.error("Payment creation error", error);
    res.status(500).json({
      msg: "Error creation payment session",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

paymentRoutes.post("/razorpay/verify", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, applicantId } = req.body;
    // TODO: zod validation
    try {
      const isValid = await verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        req.user.sub,
        applicantId
      );
      if (!isValid) {
        res.status(400).json({ msg: "Invalid payment signature" });
        return;
      }
      console.log("Razorpay Payment successfull");
      res.json({
        success: true,
        msg: "Razorpay Payment successfull"
      });
    } catch (error) {
      console.error("Razorpay verification process error", error);
      res.status(500).json({
        msg: "Error processing payment verification",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  } catch (error) {
    console.error("Razorpay payment verification error", error);
    res.status(500).json({
      msg: "Razorpay payment verification error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { paymentRoutes };
