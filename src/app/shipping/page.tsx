"use client";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:pl-32 lg:pl-48 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Shipping Policy</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="mb-4">We strive to dispatch all orders as quickly as possible. Please review our shipping practices below.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Processing Time</h2>
          <p className="mb-4">Orders placed before our daily cut-off time are processed and dispatched on the same business day. Orders placed on weekends or holidays will be processed on the next business day.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Shipping Methods</h2>
          <p className="mb-4">We offer standard and express shipping options. Delivery times may vary depending on your location and the selected courier service.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Tracking</h2>
          <p className="mb-4">Once your order is dispatched, you will receive an email with tracking information so you can monitor your delivery status.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
