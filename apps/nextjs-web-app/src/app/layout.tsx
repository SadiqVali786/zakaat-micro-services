import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen max-w-screen-2xl overflow-x-hidden", inter.className)}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { backgroundColor: "#333", borderRadius: "10px", color: "#fff" },
                success: { duration: 5000, icon: "🔥" },
                error: { duration: 5000, icon: "🔴" }
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
