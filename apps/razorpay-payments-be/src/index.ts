import cors from "cors";
import express from "express";
import { paymentRoutes } from "./routes/payment.routes";
import { PORT, ALLOWED_ORIGINS } from "./env";
import { printEnvironmentVariables } from "@repo/common/print-env-variables";
const app = express();

// Parse raw body for webhook verification
app.use("/api/v1/payment/razorpay/webhook", express.raw({ type: "*/*" }));
// Parse JSON for other routes
app.use(express.json());

printEnvironmentVariables();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-razorpay-signature"]
  })
);

app.use("/api/v1/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running @ http://localhost:${PORT}`);
});
