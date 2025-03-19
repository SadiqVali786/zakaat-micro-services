import type { Metadata } from "next";
import "@/app/globals.css";
import MobileNavbar from "@/components/MobileNavbar";
import GuestLeftSidebar from "@/components/dashboard/guest-left-sidebar";
// import GuestLeftSidebar from "@/components/dashboard/guest-left-sidebar";

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
          <GuestLeftSidebar />
          <div className="w-full flex-grow">
            {children}
            <MobileNavbar />
          </div>
        </main>
      </body>
    </html>
  );
}
