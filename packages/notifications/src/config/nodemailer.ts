import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } from "../env";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST ?? "smtp.gmail.com",
  port: EMAIL_PORT ?? 587,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const sendEmailWithHTML = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({ from: EMAIL_USER, to, subject, html });
};
