"use client";

import {
  Tailwind,
  Body,
  Container,
  Img,
  Section,
  Text,
  Heading,
  Link,
  Head,
  Html
} from "@react-email/components";
import { render } from "@react-email/render";

const OnboardingEmail = ({ donorName }: { donorName: string }) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="flex h-full w-full items-center justify-center bg-[#ECEBFE] font-sans">
          <Container className="mx-auto max-w-3xl px-2 py-8">
            {/* Logo Section */}
            <Img
              src="https://res.cloudinary.com/dud648ixu/image/upload/v1744893907/big-logo_pt35dl.png"
              width="80"
              height="80"
              alt="Zakaat"
              className="mx-auto mb-8"
            />

            {/* Header Section */}
            <Heading className="mb-6 text-center text-3xl font-bold text-[#030014]">
              Welcome to Our Community, {donorName}!
            </Heading>

            {/* Main Content */}
            <Section className="mb-8 rounded-lg bg-[#ECEBFE] px-2 py-8">
              <Text className="mb-4 text-lg leading-relaxed font-semibold text-[#030014]">
                Thank you for joining our community of donors. We're excited to have you with us and
                committed to making your zakaat donation experience smooth and meaningful.
              </Text>

              <Text className="mb-4 text-lg leading-relaxed font-semibold text-[#030014]">
                At Zakaat, you can donate directly to applicants’ bank accounts, no middlemen.
                Connect with them via chat or video calls, all while keeping your & applicant's
                contact details private.
              </Text>

              <Text className="mb-6 text-lg leading-relaxed font-semibold text-[#030014]">
                With AI-powered facial verification and in-person document checks, we ensure your
                Zakaat reaches those truly in need. Your generosity brings real, lasting change.
              </Text>

              {/* CTA Button */}
              <div className="text-center">
                <Link
                  href="https://zakaat.in"
                  className="inline-block rounded-md bg-[#BE52F2] px-8 py-3 text-xl font-bold text-[#F9EEFE]"
                >
                  Explore Dashboard
                </Link>
              </div>
            </Section>

            {/* Footer */}
            <Text className="text-center text-sm text-[#474553]">
              With gratitude, The zakaat Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const OnboardingEmailSubject =
  "Welcome to Zakaat! Thank you for joining our community of donors.";

export const OnboardingEmailHTMLString = async (donorName: string) =>
  await render(<OnboardingEmail donorName={donorName} />);

export default OnboardingEmail;
