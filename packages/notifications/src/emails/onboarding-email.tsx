import {
  Tailwind,
  Body,
  Preview,
  Container,
  Img,
  Section,
  Text,
  Html,
  Head,
  Heading,
  Link,
} from "@react-email/components";
import { render } from "@react-email/components";

const OnboardingEmail = ({ donorName }: { donorName: string }) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#ECEBFE] font-sans w-full h-full flex items-center justify-center">
          <Container className="mx-auto px-2 py-8 max-w-3xl">
            {/* Logo Section */}
            <Img
              src="https://res.cloudinary.com/dud648ixu/image/upload/v1744893907/big-logo_pt35dl.png"
              width="80"
              height="80"
              alt="Zakaat"
              className="mx-auto mb-8"
            />

            {/* Header Section */}
            <Heading className="text-3xl font-bold text-center text-[#030014] mb-6">
              Welcome to Our Community, {donorName}!
            </Heading>

            {/* Main Content */}
            <Section className="bg-[#ECEBFE] rounded-lg py-8 px-2 mb-8">
              <Text className="text-[#030014] text-lg font-semibold leading-relaxed mb-4">
                Thank you for joining our community of donors. We're excited to
                have you with us and committed to making your zakaat donation
                experience smooth and meaningful.
              </Text>

              <Text className="text-[#030014] text-lg font-semibold leading-relaxed mb-4">
                At Zakaat, you can donate directly to applicants’ bank accounts,
                no middlemen. Connect with them via chat or video calls, all
                while keeping your & applicant's contact details private.
              </Text>

              <Text className="text-[#030014] text-lg font-semibold leading-relaxed mb-6">
                With AI-powered facial verification and in-person document
                checks, we ensure your Zakaat reaches those truly in need. Your
                generosity brings real, lasting change.
              </Text>

              {/* CTA Button */}
              <div className="text-center">
                <Link
                  href="https://zakaat.in"
                  className="inline-block px-8 py-3 rounded-md bg-[#BE52F2] text-[#F9EEFE] font-bold text-xl"
                >
                  Explore Dashboard
                </Link>
              </div>
            </Section>

            {/* Footer */}
            <Text className="text-[#474553] text-center text-sm">
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
