import { Button, Html, Text } from "@react-email/components";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MyEmail = ({ username }: { username: string }) => {
  return (
    <Html>
      <Text>Hi {username}</Text>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me Brother
      </Button>
    </Html>
  );
};

export const sendEmail = async () => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["rebirth4vali@gmail.com"],
    subject: "Hello world",
    react: MyEmail({ username: "John" })
  });
};
