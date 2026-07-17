import * as React from 'react';
import { useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CheckCircle2, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function OrderConfirmationPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when landing on the confirmation page
    clearCart();
  }, [clearCart]);

  // Generate a random order number
  const orderNumber = `XFP-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-4">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order. Your research peptides are being processed and will be dispatched shortly.
            </p>
            
            <div className="bg-background border border-border rounded-xl p-6 mb-8 text-left flex items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-lg hidden sm:block">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Order Number</p>
                <p className="font-mono text-2xl text-foreground">{orderNumber}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 h-12 px-8">
                  Continue Browsing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
