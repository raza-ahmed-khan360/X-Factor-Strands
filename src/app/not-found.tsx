"use client";
import * as React from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-xl">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-accent" />
          </div>

          <h1 className="text-6xl font-display font-extrabold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-3">Page Not Found</h2>
          <p className="text-muted-foreground text-base mb-8 leading-relaxed">
            The page or compound parameter you requested could not be found in our database. It may have been moved or updated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 border-border">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="w-full sm:w-auto flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="w-4 h-4" />
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
