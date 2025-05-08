import { auth } from "@/auth";
import { APP_PATHS } from "@/config/path.config";
import { UserRole } from "@repo/common/types";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await auth();

  if (session?.user.role === UserRole.Donor) {
    return redirect(APP_PATHS.DONOR_DASHBOARD_TWEETS);
  }

  if (session?.user.role === UserRole.Applicant) {
    return redirect(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
  }

  if (session?.user.role === UserRole.Verifier) {
    return redirect(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
  }

  return redirect(APP_PATHS.HOME);
}
