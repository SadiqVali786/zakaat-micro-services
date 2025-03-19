"use client";

import { promisifiedToast } from "@/components/react-hot-toast";
import { sendMyEmail } from "@repo/notifications";

export default function Page() {
  return (
    <div className="container">
      <button
        onClick={() =>
          promisifiedToast(() =>
            sendMyEmail(
              "onboarding@resend.dev",
              "rebirth4vali@gmail.com",
              "hello world! Testing done bro"
            )
          )
        }
      >
        Send Email
      </button>
    </div>
  );
}
