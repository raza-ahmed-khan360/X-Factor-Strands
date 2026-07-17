import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HoverAccordion } from '@/components/HoverAccordion';

export default function FAQPage() {
  const faqs = [
    {
      category: "Product & Research",
      questions: [
        { q: "Are your products for research purposes only?", a: "Yes. All products sold by X Factor Peptides are strictly for laboratory and scientific research purposes only. They are not intended for human consumption, veterinary use, or any other purpose." },
        { q: "How should research peptides be stored?", a: "For long-term storage, lyophilised peptides should be kept at -20°C. They can be stored refrigerated at 4°C for short periods. Protect all compounds from light and moisture." },
        { q: "What purity standards do you maintain?", a: "We only stock products that have been verified to meet a minimum purity standard of 98%, with many exceeding 99% purity via HPLC." },
      ]
    },
    {
      category: "Ordering & Shipping",
      questions: [
        { q: "How are products shipped?", a: "We dispatch all orders promptly using tracked courier services. Orders are packaged securely and discreetly to ensure product integrity during transit." },
        { q: "How long does shipping take?", a: "Standard delivery typically takes 2-3 business days within the UK. Express options are available at checkout." },
        { q: "Can I track my order?", a: "Yes. Once your order is dispatched, you will receive tracking information by email so you can monitor your delivery." },
        { q: "What countries do you ship to?", a: "Currently, we supply exclusively to researchers and laboratories based within the United Kingdom." },
        { q: "Are there minimum order quantities?", a: "No, we do not impose minimum order quantities. We cater to both individual independent researchers and larger laboratory facilities." },
      ]
    },
    {
      category: "Payment & Support",
      questions: [
        { q: "What payment methods do you accept?", a: "We accept major credit and debit cards and bank transfer. All transactions are processed securely." },
        { q: "How do I contact support?", a: "You can reach our team via the Contact page, by email, or by phone. We aim to respond to all enquiries within a few hours during business hours." },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">Find answers to common questions about our products, shipping, and policies.</p>
          </div>
          
          <div className="space-y-12">
            {faqs.map((group, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-display font-bold mb-6 text-accent">{group.category}</h2>
                <div className="space-y-4">
                  {group.questions.map((faq, i) => (
                    <HoverAccordion key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-8 bg-card border border-border rounded-xl text-center">
            <h3 className="font-display text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our team is here to help with any specific enquiries.</p>
            <a href="/contact" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
