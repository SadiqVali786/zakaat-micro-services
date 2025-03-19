import AboutSection from "./_components/AboutSection";
import FaqsSection from "./_components/FaqsSection";
import FeaturesSection from "./_components/FeaturesSection";
import FooterSection from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import Navbar from "./_components/navbar";
import TestimonialsSection from "./_components/TestimonialsSection";
import WhySection from "./_components/WhySection";

export default function Home() {
  return (
    <main className="relative flex-1">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WhySection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqsSection />
      <FooterSection />
    </main>
  );
}
