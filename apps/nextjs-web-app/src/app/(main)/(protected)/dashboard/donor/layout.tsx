import "@/app/globals.css";
import type { Metadata } from "next";
import RightSidebar from "@/components/dashboard/RightSidebar";
import MobileNavbar from "@/components/MobileNavbar";
import DonorLeftSidebar from "@/components/dashboard/LeftSidebar";

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
      <body className="mx-auto min-h-screen max-w-[1440px] overflow-x-hidden text-blue-50 antialiased">
        <main
          className="mx-auto flex w-full"
          style={{
            paddingLeft: "clamp(1rem, 4.9vw, 5rem)",
            paddingRight: "clamp(1rem, 4.9vw, 5rem)"
          }}
        >
          <DonorLeftSidebar />
          <div className="w-full flex-grow">
            {children}
            <MobileNavbar />
          </div>
          <RightSidebar />
        </main>
      </body>
    </html>
  );
}
