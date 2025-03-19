"use server";

import { resend } from "./config/resend-config";
import { Email } from "./my-email";

export const sendMyEmail = async (from: string, to: string, subject: string) => {
  try {
    await resend.emails.send({
      from, // "onboarding@resend.dev"
      to, // "rebirth4vali@gmail.com"
      subject, // "hello world!"
      react: Email({ url: "https://example.com" })
    });
    return "Email Sent Successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Email Failed to sent");
  }
};
