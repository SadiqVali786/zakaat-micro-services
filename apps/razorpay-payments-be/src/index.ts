import cors from "cors";
import express from "express";
import { paymentRoutes } from "./routes/payment.routes";
import { PORT } from "./env";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use("/api/v1/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running @ http://localhost:${PORT}`);
});
