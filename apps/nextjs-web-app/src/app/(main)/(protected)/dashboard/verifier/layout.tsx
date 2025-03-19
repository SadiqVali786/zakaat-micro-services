import type { Metadata } from "next";
import "@/app/globals.css";
import VerifierLeftSidebar from "@/components/dashboard/verifier-left-sidebar";
import MobileNavbar from "@/components/MobileNavbar";
// import MobileNavbar from "@/components/MobileNavbar";
// import VerifierLeftSidebar from "@/components/dashboard/verifier-left-sidebar";

export const metadata: Metadata = {
  title: "Zakaat",
  description:
    "Zakaat distribution web app for deserving, verified poor individuals in your locality and among relatives who can't directly ask for help due to dignity."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="mx-auto flex min-h-screen max-w-[1440px] overflow-x-hidden text-blue-50 antialiased">
        <main
          className="mx-auto flex w-full"
          style={{
            paddingLeft: "clamp(1rem, 4.9vw, 5rem)",
            paddingRight: "clamp(1rem, 4.9vw, 5rem)"
          }}
        >
          <VerifierLeftSidebar />
          <div className="grow">
            {children}
            <MobileNavbar />
          </div>
        </main>
      </body>
    </html>
  );
}
