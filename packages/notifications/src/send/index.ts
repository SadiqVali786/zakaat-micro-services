import { OnboardingEmailHTMLString } from "../emails/onboarding-email";
import { OnboardingEmailSubject } from "../emails/onboarding-email";
import { sendEmailWithHTML } from "../config/nodemailer";

export const sendOnboardingEmail = async (
  donorEmail: string,
  donorName: string
) => {
  try {
    const htmlString = await OnboardingEmailHTMLString(donorName);
    const res = await sendEmailWithHTML(
      donorEmail,
      OnboardingEmailSubject,
      htmlString
    );
    return res;
  } catch (error) {
    console.error("Error while sending onboarding email", error);
    return null;
  }
};
