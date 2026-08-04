"use client";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:pl-32 lg:pl-48 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Returns & Refunds</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="mb-4">Due to the sensitive nature of our research compounds, we have a strict policy on returns.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Return Eligibility</h2>
          <p className="mb-4">We cannot accept returns on opened or tampered products to ensure the integrity of our supply chain and protect our customers' research.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Issues with Orders</h2>
          <p className="mb-4">If there is an error with your order or if an item arrives damaged, please contact our support team within 48 hours of delivery with photographic evidence, and we will promptly arrange a replacement or refund.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Refund Process</h2>
          <p className="mb-4">Approved refunds will be processed back to the original method of payment within 5-10 business days.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
