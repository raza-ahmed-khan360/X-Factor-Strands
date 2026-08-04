"use client";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:pl-32 lg:pl-48 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="mb-4">At X Factor Peptides, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Data Collection</h2>
          <p className="mb-4">We collect necessary information required to process your orders, including your name, shipping address, and email for tracking notifications.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Data Security</h2>
          <p className="mb-4">Your data is secured using industry-standard encryption protocols. We do not store full credit card information on our servers; all payments are processed securely via Stripe.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Third-Party Sharing</h2>
          <p className="mb-4">We never sell your personal data. We only share information with essential service providers, such as shipping couriers, to fulfill your orders.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
