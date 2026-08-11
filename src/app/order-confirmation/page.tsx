"use client";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { CheckCircle2, Package, Banknote, MapPin, Phone, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function OrderConfirmationPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Clear the cart when landing on the confirmation page
    clearCart();

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('last_order');
      if (saved) {
        try {
          setOrder(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [clearCart]);

  const fallbackOrderNumber = `XFP-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent" />

            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>

            <h1 className="text-4xl font-display font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. Your research peptides have been scheduled for <b>Cash on Delivery</b>.
            </p>

            {/* Order Info Card */}
            <div className="bg-background border border-border rounded-xl p-6 mb-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order Number</p>
                  <p className="font-mono text-xl font-bold text-foreground">{order?.orderNumber || fallbackOrderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Payment Method</p>
                  <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md flex items-center gap-1 mt-1">
                    <Banknote className="w-3.5 h-3.5" /> Cash on Delivery
                  </span>
                </div>
              </div>

              {order?.customer && (
                <div className="space-y-2 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span>
                      {order.customer.firstName} {order.customer.lastName} &bull; {order.customer.address}, {order.customer.city} ({order.customer.postalCode})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                </div>
              )}

              {order?.items && order.items.length > 0 && (
                <div className="border-t border-border pt-4 mt-2 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Items Ordered</p>
                  {order.items.map((item: any, idx: number) => (
                    <div key={item.cartItemId || item.id || `${item.name}-${idx}`} className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">
                        {item.name} ({item.size}) &times; {item.quantity}
                      </span>
                      <span className="text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-base text-foreground">
                    <span>Total Payable Cash:</span>
                    <span className="text-accent">${order.total?.toFixed(2) ?? '0.00'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-xs text-muted-foreground mb-8 text-left flex items-start gap-2">
              <Truck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                Please have <b>${order?.total ? order.total.toFixed(2) : 'the exact total amount'}</b> in cash ready when the delivery rider arrives.
              </span>
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
