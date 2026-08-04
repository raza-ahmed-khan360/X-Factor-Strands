import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

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
    template: "%s | X Factor Peptides",
    default: "X Factor Peptides | Premium Research Peptides",
  },
  description: "X Factor Peptides provides high-quality, research-grade peptides for laboratory and scientific use in the USA. Fast shipping and hands-on customer service.",
  keywords: ["research peptides", "buy peptides online", "premium peptides", "laboratory research", "X Factor Peptides"],
  authors: [{ name: "X Factor Peptides" }],
};

import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
