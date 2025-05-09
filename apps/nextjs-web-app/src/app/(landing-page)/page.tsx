import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { About } from "./_components/about";
import { WhyChooseUs } from "./_components/why-choose-us";
import Features from "./_components/features";
import Testimonials from "./_components/testimonials";
import Faqs from "./_components/faqs";
import Footer from "./_components/footer";

export default async function LandingPage() {
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
