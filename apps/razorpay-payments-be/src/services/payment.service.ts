import crypto from "crypto";
import { razorpay } from "../config/razorpay.instance";

export const createRazorpayOrder = async (amount: number, donorId: string, applicantId: string) => {
  try {
    const orderData = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, // TODO: extend it
      notes: {
        donorId,
        applicantId,
        amount
      }
    };

    const order = await new Promise((resolve, reject) => {
      razorpay.orders.create(orderData, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
    console.log("Razorpay order created successfully: ", order);

    // TODO: create transaction database entry => send it to redis queue

    return {
      id: orderData.receipt,
      order_id: (order as any).id,
      amount,
      currency: "INR",
      name: "Zakaat App",
      notes: {
        donorId,
        applicantId,
        amount
      }
    };
  } catch (error) {
    console.log("Razorpay Order Creation Error:", error);
    throw error;
  }
};

export const verifyPaymentSignature = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  donorId: string,
  applicantId: string
) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret key not configured");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    const isValid = expectedSignature === razorpay_signature;

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const amount = order.amount;
    const currency = order.currency;

    // TODO: find existing pending transaction
    const existingPendingTransaction = {};
    if (!existingPendingTransaction) {
      throw new Error("No pending transaction found for this razorpay_order_id");
    }
    // TODO: update transaction status => send it to redis queue

    return isValid;
  } catch (error) {
    console.error("Razorpay Payment verification error", error);
    throw error;
  }
};

// // Add retry logic for database operations
// async function withRetry<T>(
//   operation: () => Promise<T>,
//   retries = 3,
//   delay = 1000
// ): Promise<T> {
//   try {
//     return await operation();
//   } catch (error) {
//     if (
//       retries > 0 &&
//       error instanceof Error &&
//       error.message.includes("Can't reach database server")
//     ) {
//       console.log(`Retrying operation, ${retries} attempts left`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       return withRetry(operation, retries - 1, delay * 2);
//     }
//     throw error;
//   }
// }

// export async function ad_entry(
//   arguements
// ) {
//   try {
//     return await withRetry(() =>
//       prisma.$transaction(async (txn) => {
//         const subscription = await txn.table.create({
//           data: { ...arguements },
//         });
//         const plan = await txn.table.create({
//           data: { ...arguements },
//         });
//         return subscription;
//       })
//     );
//   } catch (error) {
//     console.error("Subscription creation error:", error);
//     throw error;
//   }
// }
