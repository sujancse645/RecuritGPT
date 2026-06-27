import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecruitGPT | AI Recruitment Operating System",
  description: "Enterprise AI Recruitment Intelligence Platform. Beyond Keywords. Beyond Resumes. Beyond ATS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-[#030712] text-white min-h-screen selection:bg-electric-blue/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
