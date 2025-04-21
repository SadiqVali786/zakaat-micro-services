import iPhoneHero from "@/../public/landing-page/hero/iphone-hero.png";
import { SectionTemplate } from "../global";

export const Hero = () => {
  return (
    <SectionTemplate
      pillText="✨ Find Deserving Zakaat Recipients Here"
      headingPart1="Maximize Your Zakaat Impact, "
      headingPart2="Support the Deserving Muslims in Need"
      infoLine="Fulfill your duty of Zakat with purpose, backed by the power of Artificial Intelligence. Our platform ensures your contributions reach truly deserving Muslims by safeguarding against fraudulent applications. Connect with those genuinely in need."
      headingFontClamp="text-35-to-65-with-768-to-1440"
      sectionImage={iPhoneHero}
      className="md:mt-120-to-175-with-768-to-1440 mt-90-to-120-with-375-to-768"
    />
  );
};
