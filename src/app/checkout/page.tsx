"use client";
import * as React from 'react';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Trash2, ShoppingBag, ArrowRight, Banknote, ShieldCheck, Truck, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod', // Cash on delivery
  });

  const [shippingFee, setShippingFee] = useState(5.99);

  React.useEffect(() => {
    import('@/app/x-factor-admin/orders/actions').then(({ getCodShippingFeeAction }) => {
      getCodShippingFeeAction().then((res) => {
        if (res?.fee !== undefined) setShippingFee(res.fee);
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const orderNumber = `XFP-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = getTotalPrice();
    const shipping = shippingFee;
    const total = subtotal + shipping;

    const orderData = {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      paymentMethod: 'Cash on Delivery (COD)',
      totalAmount: total,
      items: items.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('last_order', JSON.stringify({
        ...orderData,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        subtotal,
        shipping,
        total,
      }));
    }

    try {
      const { createOrderAction } = await import('@/app/x-factor-admin/orders/actions');
      await createOrderAction(orderData);
    } catch (err) {
      console.error('Order creation background call error:', err);
    }

    setTimeout(() => {
      router.push('/order-confirmation');
    }, 500);
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
                      <div key={item.cartItemId} className="flex items-center justify-between pb-6 border-b border-border/50 last:border-0 last:pb-0">
                        <div>
                          <h3 className="font-display font-medium text-lg">
                            {item.name} <span className="text-sm text-muted-foreground ml-2">{item.size}</span>
                          </h3>
                          <p className="text-accent font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-3 py-1 text-muted-foreground hover:text-foreground"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-3 py-1 text-muted-foreground hover:text-foreground"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
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

                {/* Shipping & Contact Form */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-display font-semibold mb-6">Shipping Details</h2>
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (US format required for COD)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address (US)</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Science Way, Suite 400"
                        className="bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City & State</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="New York, NY"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">ZIP Code</Label>
                        <Input
                          id="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="10001"
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Payment Method Selection (Cash on Delivery) */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-display font-semibold mb-4">Payment Method</h2>
                  
                  <div className="p-4 rounded-xl border-2 border-accent bg-accent/5 flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                          Cash on Delivery (COD)
                          <span className="text-[10px] font-sans font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        </h3>
                        <CheckCircle className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay in cash to the courier driver upon delivery of your parcel to your specified address. No advance payment required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total Sidebar */}
              <div className="lg:col-span-5">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-28 space-y-6">
                  <h2 className="text-2xl font-display font-semibold">Total</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-accent" /> Express Delivery
                      </span>
                      <span>${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Payment Processing</span>
                      <span className="text-accent font-medium">Free (COD)</span>
                    </div>

                    <div className="h-px bg-border my-2" />

                    <div className="flex justify-between text-xl font-display font-bold">
                      <span>Total Due (on delivery)</span>
                      <span className="text-accent">${(getTotalPrice() + shippingFee).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-xs text-foreground/80 leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>
                      By placing this order, you confirm that these research compounds are strictly for laboratory use and agree to pay <b>${(getTotalPrice() + shippingFee).toFixed(2)}</b> in cash upon delivery.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={submitting}
                    className="w-full h-14 text-lg bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {submitting ? 'Processing Order...' : 'Place COD Order'} <ArrowRight className="w-5 h-5" />
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
