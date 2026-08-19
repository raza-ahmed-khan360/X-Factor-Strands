"use client";
import * as React from 'react';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PAYMENT_METHODS } from '@/lib/paymentConfig';

import { Trash2, ShoppingBag, Tag, Sparkles, X, Loader2, ArrowRight, ShieldCheck, Truck, CheckCircle, Smartphone, Building2, Wallet, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [researchCertified, setResearchCertified] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cashapp' as 'cashapp' | 'venmo' | 'zelle',
  });

  const [shippingFee, setShippingFee] = useState(5.99);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    description?: string;
  } | null>(null);

  React.useEffect(() => {
    import('@/app/x-factor-admin/orders/actions').then(({ getCodShippingFeeAction }) => {
      getCodShippingFeeAction().then((res) => {
        if (res?.fee !== undefined) setShippingFee(res.fee);
      });
    });
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const { validateCouponAction } = await import('@/app/x-factor-admin/discounts/actions');
      const res = await validateCouponAction({
        code: couponCodeInput.trim(),
        email: formData.email,
        phone: formData.phone,
        subtotal: getTotalPrice(),
      });

      if (res.valid && res.code && res.discountAmount !== undefined) {
        setAppliedCoupon({
          code: res.code,
          discountType: res.discountType || 'percentage',
          discountValue: res.discountValue || 0,
          discountAmount: res.discountAmount,
          description: res.description,
        });
        setCouponCodeInput('');
      } else {
        setCouponError(res.error || 'Invalid promo code');
      }
    } catch {
      setCouponError('Failed to validate promo code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const selectedMethod = PAYMENT_METHODS[formData.paymentMethod] || PAYMENT_METHODS.cashapp;
    const orderNumber = `XFP-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = getTotalPrice();
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const shipping = shippingFee;
    const total = Math.max(0, subtotal - discountAmount + shipping);

    const orderData = {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      paymentMethod: selectedMethod.name,
      paymentMethodId: selectedMethod.id,
      totalAmount: total,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0,
      status: 'pending' as const,
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
      if (appliedCoupon?.code) {
        const { incrementCouponUsage } = await import('@/app/x-factor-admin/discounts/actions');
        incrementCouponUsage(appliedCoupon.code);
      }
    } catch (err) {
      console.error('Order creation background call error:', err);
    }

    setTimeout(() => {
      router.push(`/order-confirmation?orderNumber=${orderNumber}`);
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
                        <Label htmlFor="phone">Phone Number (US Format)</Label>
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

                {/* Direct Online Advance Payment Selection */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-display font-semibold">Select Direct Payment Option</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose your preferred direct payment method. Instructions & screenshot upload will be provided on the next page.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Cash App */}
                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cashapp' }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        formData.paymentMethod === 'cashapp'
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'border-border bg-background/50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                            Cash App
                            <span className="text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Instant Mobile Pay
                            </span>
                          </h3>
                          {formData.paymentMethod === 'cashapp' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Pay directly via Cash App. Quick one-click mobile checkout with screenshot proof upload.
                        </p>
                      </div>
                    </div>

                    {/* Venmo */}
                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'venmo' }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        formData.paymentMethod === 'venmo'
                          ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                          : 'border-border bg-background/50 hover:border-sky-500/40'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 shrink-0 mt-0.5 border border-sky-500/20">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                            Venmo
                            <span className="text-[10px] font-sans font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Instant Mobile Pay
                            </span>
                          </h3>
                          {formData.paymentMethod === 'venmo' && <CheckCircle className="w-5 h-5 text-sky-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Pay via Venmo mobile app. Fast transfer with order number memo.
                        </p>
                      </div>
                    </div>

                    {/* Zelle */}
                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'zelle' }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        formData.paymentMethod === 'zelle'
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                          : 'border-border bg-background/50 hover:border-purple-500/40'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                            Zelle
                            <span className="text-[10px] font-sans font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Direct Bank Transfer
                            </span>
                          </h3>
                          {formData.paymentMethod === 'zelle' && <CheckCircle className="w-5 h-5 text-purple-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Direct fee-free transfer from your online banking app (Chase, Bank of America, Wells Fargo, etc.).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total Sidebar */}
              <div className="lg:col-span-5">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-28 space-y-6">
                  <h2 className="text-2xl font-display font-semibold">Total Summary</h2>

                  {/* Promo Code Box */}
                  <div className="bg-background/50 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold">Promo / Discount Code</span>
                    </div>
                    
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                            <CheckCircle className="w-4 h-4" /> {appliedCoupon.code} Applied!
                          </span>
                          <span className="text-xs text-emerald-500/80 mt-0.5">-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `$${appliedCoupon.discountValue.toFixed(2)}`} discount</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                          placeholder="e.g. WELCOME10"
                          className="flex-grow w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent text-white font-mono uppercase transition-colors"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon(e as any))}
                        />
                        <Button 
                          type="button" 
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponCodeInput.trim()}
                          className="bg-accent text-white hover:bg-accent/90 shrink-0 h-auto py-2"
                        >
                          {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                        </Button>
                      </div>
                    )}
                    
                    {couponError && (
                      <p className="text-xs text-destructive mt-2 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> {couponError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Discount ({appliedCoupon.code})
                        </span>
                        <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-accent" /> Express Dispatch
                      </span>
                      <span>${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Selected Payment</span>
                      <span className="font-bold text-accent">
                        {PAYMENT_METHODS[formData.paymentMethod]?.name || 'Direct Pay'}
                      </span>
                    </div>

                    <div className="h-px bg-border my-2" />

                    <div className="flex justify-between text-xl font-display font-bold">
                      <span>Total Amount Due</span>
                      <span className="text-accent">${(getTotalPrice() - (appliedCoupon?.discountAmount || 0) + shippingFee).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="researchCertCheckbox"
                        required
                        checked={researchCertified}
                        onChange={(e) => setResearchCertified(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border bg-background text-accent focus:ring-accent accent-accent cursor-pointer"
                      />
                      <label htmlFor="researchCertCheckbox" className="text-xs text-foreground/90 leading-relaxed cursor-pointer select-none">
                        <strong className="text-accent font-semibold block mb-0.5">Mandatory Laboratory Research Certification</strong>
                        I certify that all purchased items are exclusively for in-vitro analytical, chemical, and laboratory research use by qualified personnel. I explicitly acknowledge that these compounds are strictly NOT for human or animal consumption, medical, or diagnostic administration.
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={submitting || !researchCertified}
                    className="w-full h-14 text-lg bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {submitting ? 'Processing Order...' : `Proceed with ${PAYMENT_METHODS[formData.paymentMethod]?.name}`} <ArrowRight className="w-5 h-5" />
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
