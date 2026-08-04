"use client";
import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function ResearchDisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mt-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center text-accent">Research Use Only Disclaimer</h1>
            
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="font-medium text-foreground">
                <strong>IMPORTANT: Please read this disclaimer carefully before using this website or purchasing any products from X Factor Peptides.</strong>
              </p>

              <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">1. Strictly for Laboratory Research Only</h3>
              <p>
                All products supplied by X Factor Peptides are strictly for laboratory and scientific research purposes only. They are not intended for human consumption, animal consumption, therapeutic use, clinical diagnostic use, or agricultural use.
              </p>

              <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">2. Not for Human Consumption</h3>
              <p>
                Under no circumstances should any products purchased from this site be used on humans. These compounds have not been evaluated or approved by the MHRA, FDA, or any other regulatory body for human use. They are not intended to diagnose, treat, cure, or prevent any disease, medical condition, or physiological state.
              </p>

              <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">3. Customer Responsibility</h3>
              <p>
                By purchasing from X Factor Peptides, you confirm that you are a qualified researcher, scientist, or institution purchasing for legitimate in-vitro or laboratory research purposes. Customers are solely responsible for ensuring compliance with all applicable local, national, and international laws, regulations, and guidelines in their jurisdiction regarding the handling, possession, and use of these research materials.
              </p>

              <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">4. Handling and Safety</h3>
              <p>
                Research peptides must only be handled by qualified professionals who are familiar with the hazards associated with these materials. It is the responsibility of the purchaser to ensure proper safety protocols are established and followed in their laboratory environment.
              </p>

              <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">5. Limitation of Liability</h3>
              <p>
                X Factor Peptides makes no representations or warranties, express or implied, regarding the suitability of our products for any particular purpose. X Factor Peptides shall not be held liable for any damages, incidental or consequential, arising from the misuse, improper handling, or inappropriate application of any products sold on this website.
              </p>
              
              <div className="mt-12 p-6 bg-background border-l-4 border-accent rounded-r-lg">
                <p className="text-sm font-medium text-foreground mb-0">
                  We reserve the right to deny service or cancel orders if we suspect that our products are being purchased for purposes other than laboratory research, or if we have reason to believe the purchaser is not qualified to handle these materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
