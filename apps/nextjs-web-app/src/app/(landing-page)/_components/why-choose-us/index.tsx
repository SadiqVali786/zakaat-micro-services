import iPhoneHero from "@/../public/landing-page/why-choose-us/iPhone-why.png";

import { SectionTemplate } from "../global";

export const WhyChooseUs = () => {
  return (
    <section className="mt-180-to-250-with-768-to-1440 gap-y-60-to-90-with-768-to-1440 flex flex-col items-center justify-center overflow-x-hidden">
      <h2 className="lg:px-40-to-80-with-768-to-1440 px-8-to-40-with-375-to-768 text-35-to-55-with-768-to-1440 leading-none font-bold text-purple-100 sm:text-center">
        Why Choose Our Platform for Donations?
      </h2>
      <SectionTemplate
        pillText="✨ Find Your Relatives, Friends & neighbours"
        headingPart1="Reaching out to friends and family for Zakaat can be challenging. "
        headingPart2="Many may hesitate to request it out of dignity."
        infoLine="We connect Zakaat donors with those in need for free. Donors can help friends or relatives if they're on our platform. Applicants can stay anonymous, but sharing details may build trust and improve their chances of receiving Zakaat."
        className="!mt-0"
        headingFontClamp="text-30-to-45-with-768-to-1440"
        sectionImage={iPhoneHero}
        hideApps={true}
      />
    </section>
  );
};
