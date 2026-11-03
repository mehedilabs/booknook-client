import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppToaster } from "@/components/shared/AppToaster";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description:
    "Discover, explore and borrow your favorite books with BookNook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#EEF1EA] text-[#17302A]">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {children}
        <Footer />
        <AppToaster />
      </body>
    </html>
  );
}
