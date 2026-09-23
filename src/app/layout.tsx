import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://xfactorpeptides.com"),
  title: {
    template: "%s | X Factor Peptides",
    default: "X Factor Peptides | Premium Research Peptides",
  },
  description: "X Factor Peptides provides high-quality, research-grade peptides for laboratory and scientific use in the USA. Fast shipping and hands-on customer service.",
  keywords: ["research peptides", "buy peptides online", "premium peptides", "laboratory research", "X Factor Peptides"],
  authors: [{ name: "X Factor Peptides" }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "X Factor Peptides | Premium Research Peptides",
    description: "High-quality, research-grade peptides for laboratory and scientific use in the USA. Fast shipping and hands-on customer service.",
    url: "https://xfactorpeptides.com",
    siteName: "X Factor Peptides",
    images: [
      {
        url: "/new-products/semaglutide-glp1.jpeg",
        width: 1200,
        height: 630,
        alt: "X Factor Peptides - Premium Research Peptides",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "X Factor Peptides | Premium Research Peptides",
    description: "High-quality, research-grade peptides for laboratory and scientific use in the USA.",
    images: ["/new-products/semaglutide-glp1.jpeg"],
  },
};

import WhatsAppWrapper from "@/components/WhatsAppWrapper";
import { ResearchGateModal } from "@/components/shared/ResearchGateModal";
import { Toaster } from "sonner";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KP7F5Z0WF8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KP7F5Z0WF8');
          `}
        </Script>
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "X Factor Peptides",
              "url": "https://xfactorpeptides.com",
              "logo": "https://xfactorpeptides.com/new-products/semaglutide-glp1.jpeg",
              "description": "High-quality, research-grade peptides for laboratory and scientific use in the USA.",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": "English"
              }
            }
          `}
        </Script>
        <CustomCursor />
        {children}
        <WhatsAppWrapper />
        <ResearchGateModal />
        <Toaster position="top-right" richColors closeButton theme="dark" />
      </body>
    </html>
  );
}
