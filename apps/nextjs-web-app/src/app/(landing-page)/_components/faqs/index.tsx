import { Pill, Heading } from "../global";
import Faq from "./Faq";

const FAQS = [
  {
    question: "Can I apply for Zakaat without revealing my face and personal details?",
    answer:
      "Your privacy is our top priority. We never display your personal details or photos to others on our platform. If you feel uncomfortable accepting Zakaat from specific individuals, such as family or friends, you can opt to exclude them as donors. This way, you have complete control over who contributes to your cause, ensuring that you feel at ease and respected throughout the process."
  },
  {
    question: "Is this Platform Free for Zakaat Donors & Recipients?",
    answer:
      "Absolutely! Our platform is completely free for both Zakat donors and recipients. We are committed to serving the community by bridging the gap between deserving individuals and compassionate donors, without any fees or hidden charges."
  },
  {
    question: "How do you filter out the fraudulent Zakaat Applications?",
    answer:
      "Your local Islamic social activists carefully verify each Zakat applicant before uploading them to the platform. This includes home visits to assess their situation, thorough checks of documents like bank transactions, and discreet local inquiries to validate their claims. Only those who pass this rigorous verification process are listed, ensuring your Zakat reaches the most deserving individuals in your community."
  },
  {
    question: "As a Donor, can i see whom i am giving zakaat money?",
    answer:
      "Yes, in most cases, you can view details of the recipient to better understand their need and situation. However, some applicants may choose to remain anonymous. Even then, we ensure their application is verified and ranked based on need, so you can donate with confidence knowing that your Zakat is reaching someone genuinely deserving."
  },
  {
    question: "If you are doing all this for free, then how you are surviving?",
    answer:
      "Our platform is sustained through the goodwill of donors and supporters who believe in our mission. We also rely on occasional sponsorships, partnerships, and voluntary contributions from those who wish to support the operational costs of this initiative. Our focus remains entirely on ensuring that Zakat reaches the right hands without any financial burden on the community."
  }
];

export default function FaqsSection() {
  return (
    <div className="mt-180-to-250-with-768-to-1440 px-8-to-40-with-375-to-768 md:px-40-to-80-with-768-to-1440 gap-y-60-to-90-with-768-to-1440 mx-auto flex flex-col items-center">
      <div className="flex flex-col gap-y-11">
        <Pill text="✨ Frequently Asked Questions" className="mx-0 text-center sm:mx-auto" />
        <Heading
          headingPart1="Not sure if our Zakaat platform is right for you? "
          headingPart2="We're here to help and guide you."
          className="text-35-to-55-with-768-to-1440 sm:text-center"
        />
      </div>
      <div className="flex flex-col gap-y-8">
        {FAQS.map((faq, index) => (
          <Faq key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
