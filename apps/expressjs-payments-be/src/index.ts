/* eslint-disable @typescript-eslint/no-namespace */
import { requireAuth } from "@clerk/express";
import express, { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      auth: { id?: string; profileImage?: string; email?: string };
    }
  }
}

const app = express();
app.use(express.json());
const PORT = process.env.EXPRESSJS_PAYMENTS_SERVER_PORT;

app.get(
  "/protected",
  requireAuth({ signInUrl: process.env.CLERK_SIGN_IN_URL }),
  (req: Request, res: Response) => {
    if (!req.auth?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(200).json({
      message: "Authenticated",
      userId: req.auth.id,
      email: req.auth.email,
      profileImage: req.auth.profileImage
    });
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
