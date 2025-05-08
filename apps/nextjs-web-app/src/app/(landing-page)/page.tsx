import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { About } from "./_components/about";
import { WhyChooseUs } from "./_components/why-choose-us";
import Features from "./_components/features";
import Testimonials from "./_components/testimonials";
import Faqs from "./_components/faqs";
import Footer from "./_components/footer";
import { APP_PATHS } from "@/config/path.config";
import { redirect } from "next/navigation";
import { UserRole } from "@repo/common/types";
import { auth } from "@/auth";

export default async function LandingPage() {
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

  return (
    <main className="flex w-full flex-col">
      <Navbar />
      <Hero />
      <About />
      <WhyChooseUs />
      <Features />
      <Testimonials />
      <Faqs />
      <Footer />
    </main>
  );
}
