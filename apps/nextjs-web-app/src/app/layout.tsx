import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { InitWebRTCConnection } from "@/components/hook-components/init-webrtc-connection";
import { InitWebSocketsConnection } from "@/components/hook-components/init-web-sockets-connection";
import { Toaster } from "@/components/ui/sonner";
import { printEnvironmentVariables } from "@repo/common/print-env-variables";
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zakaat",
  description:
    "Zakaat distribution web & mobile app for deserving, verified poor individuals in your locality and among relatives, neighbours who can't directly ask for help due to dignity.",
  icons: {
    icon: "@/../public/logo/logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  printEnvironmentVariables();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-brand-dark mx-auto min-h-screen max-w-[90rem] overflow-x-hidden font-sans antialiased",
          dmSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <InitWebRTCConnection />
            <InitWebSocketsConnection />
            {children}
          </SessionProvider>
          <Toaster position="top-center" richColors expand={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
