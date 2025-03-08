import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { dark } from "@clerk/themes";

import "./globals.css";
import "@repo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zakaat Money Distribution App",
  description:
    "Zakaat distribution web & mobile app for deserving, verified poor individuals in your locality and among relatives, neighbours who can't directly ask for help due to dignity."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
