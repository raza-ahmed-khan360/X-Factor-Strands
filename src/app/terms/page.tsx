"use client";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:pl-32 lg:pl-48 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="mb-4">Welcome to X Factor Peptides. By accessing our website, you agree to these Terms of Service.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Research Use Only</h2>
          <p className="mb-4">All products sold on this website are for laboratory research purposes only. They are strictly not for human consumption or veterinary use.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. User Agreement</h2>
          <p className="mb-4">By purchasing from X Factor Peptides, you confirm you are a qualified researcher and understand the risks associated with handling these compounds.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Limitation of Liability</h2>
          <p className="mb-4">X Factor Peptides shall not be liable for any damages resulting from the improper use or handling of our research products.</p>
          {/* Add more terms as needed */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
