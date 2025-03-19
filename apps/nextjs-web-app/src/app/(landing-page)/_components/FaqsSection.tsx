import Faq from "./Faq";
import Pill from "./Pill";

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
    <div
      className="mx-auto mb-44 flex flex-col items-center gap-y-24"
      style={{
        marginLeft: "clamp(1rem, 4.9vw, 5rem)",
        marginRight: "clamp(1rem, 4.9vw, 5rem)"
      }}
    >
      <div className="flex flex-col gap-y-11">
        <Pill text="✨ Frequently Asked Questions" className="mx-0 text-center sm:mx-auto" />
        <h1
          className="font-bold leading-none md:text-center"
          style={{ fontSize: "clamp(35px, 6vw, 55px)" }}
        >
          <span className="text-blue-200">Not sure if our Zakaat platform is right for you? </span>
          <span className="text-purple-200">We&apos;re here to help and guide you.</span>
        </h1>
      </div>
      <div className="flex flex-col gap-y-8">
        {FAQS.map((faq, index) => (
          <Faq key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

//
// clamp(min, curr, max) // return curr if min < curr < max else min if curr < min or max if curr > max
// clamp(50px, 8vw, 100px)
// clamp(50px, 7vw + 1rem, 100px)
//
//
// clamp(3.5rem, 12vw + 1rem, 8rem)
// clamp(2rem, 5vw, 5rem)
//
// py: min(20vh, 10rem)
// px: min(20vw, 10rem)

// max(500px, 70%)
// min(500px, 70%)
