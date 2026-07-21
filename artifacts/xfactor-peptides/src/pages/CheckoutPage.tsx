import * as React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [, setLocation] = useLocation();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect to order confirmation
    setTimeout(() => {
      setLocation('/order-confirmation');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>
          
          {items.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-xl">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-display font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any research peptides to your cart yet.</p>
              <Link href="/shop">
                <Button className="bg-primary text-white hover:bg-primary/90">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-8">
                {/* Cart Items */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-display font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between pb-6 border-b border-border/50 last:border-0 last:pb-0">
                        <div>
                          <h3 className="font-display font-medium text-lg">{item.name}</h3>
                          <p className="text-accent font-semibold">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-muted-foreground hover:text-foreground"
                            >-</button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-muted-foreground hover:text-foreground"
                            >+</button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Form */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-display font-semibold mb-6">Shipping Details</h2>
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required className="bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" required className="bg-background" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Total Sidebar */}
              <div className="lg:col-span-5">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
                  <h2 className="text-2xl font-display font-semibold mb-6">Total</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping (Next Day)</span>
                      <span>$5.99</span>
                    </div>
                    <div className="h-px bg-border my-4" />
                    <div className="flex justify-between text-xl font-display font-bold">
                      <span>Total</span>
                      <span className="text-accent">${(getTotalPrice() + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-sm text-foreground/80 mb-6">
                    By placing this order, you confirm that these products are strictly for laboratory research use only.
                  </div>

                  <Button 
                    type="submit" 
                    form="checkout-form"
                    className="w-full h-14 text-lg bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    Place Order <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
