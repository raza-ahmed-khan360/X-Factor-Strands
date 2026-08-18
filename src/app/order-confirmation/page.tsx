"use client";
import * as React from 'react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getPaymentMethodDetails } from '@/lib/paymentConfig';

import {
  CheckCircle2,
  MapPin,
  Phone,
  Copy,
  ExternalLink,
  Upload,
  Check,
  FileText,
  Loader2,
  Smartphone,
  Wallet,
  Building2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Input } from '@/components/ui/input';

function OrderConfirmationContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);

  // Upload Proof State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [uploadedProofUrl, setUploadedProofUrl] = useState<string | null>(null);
  const [copiedHandle, setCopiedHandle] = useState(false);

  useEffect(() => {
    // Clear the cart when landing on the confirmation page
    clearCart();

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('last_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrder(parsed);
          if (parsed.payment_proof_url) {
            setProofUploaded(true);
            setUploadedProofUrl(parsed.payment_proof_url);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [clearCart]);

  const fallbackOrderNumber = searchParams?.get('orderNumber') || `XFP-${Math.floor(100000 + Math.random() * 900000)}`;
  const activeOrderNumber = order?.orderNumber || fallbackOrderNumber;
  const paymentDetails = getPaymentMethodDetails(order?.paymentMethodId || order?.paymentMethod || 'cashapp');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);

      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => setFilePreview(event.target?.result as string);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleCopyHandle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Please enter your Transaction ID / Reference Number before submitting.');
      return;
    }
    if (!file && !filePreview) {
      alert('Please upload your payment screenshot or receipt image.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('orderNumber', activeOrderNumber);
      formData.append('transactionId', transactionId);
      formData.append('senderName', senderName);
      if (file) {
        formData.append('proofFile', file);
      }
      if (filePreview && !file) {
        formData.append('proofData', filePreview);
      }

      const res = await fetch('/api/orders/upload-proof', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setProofUploaded(true);
        setUploadedProofUrl(data.proofUrl || filePreview);

        // Update local storage order cache
        if (typeof window !== 'undefined' && order) {
          const updated = {
            ...order,
            payment_proof_url: data.proofUrl || filePreview,
            transaction_id: transactionId,
          };
          localStorage.setItem('last_order', JSON.stringify(updated));
        }
      } else {
        alert(data.error || 'Failed to upload proof. Please try again.');
      }
    } catch (err: any) {
      console.error('Upload proof error:', err);
      alert('An error occurred during proof upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent" />

            {/* Banner Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-accent/20">
                <CheckCircle2 className="w-9 h-9 text-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Order Created Successfully!</h1>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Order <span className="font-mono text-accent font-bold">#{activeOrderNumber}</span> is created. Please complete your advance payment via <b>{paymentDetails.name}</b> below and upload your payment proof screenshot.
              </p>
            </div>

            {/* Direct Payment Instructions Box */}
            <div className="bg-background border border-border rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payment Method</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {paymentDetails.id === 'cashapp' && <Smartphone className="w-5 h-5 text-emerald-400" />}
                    {paymentDetails.id === 'venmo' && <Wallet className="w-5 h-5 text-sky-400" />}
                    {paymentDetails.id === 'zelle' && <Building2 className="w-5 h-5 text-purple-400" />}
                    <span className="font-display font-bold text-lg text-foreground">{paymentDetails.name}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Payable Amount</span>
                  <p className="text-xl font-display font-bold text-accent">${order?.total ? order.total.toFixed(2) : '0.00'}</p>
                </div>
              </div>

              {/* Specific Payment Credentials */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        {paymentDetails.id === 'zelle' ? 'Zelle Transfer Email' : `${paymentDetails.name} Handle`}
                      </p>
                      <p className="font-mono text-lg font-bold text-foreground mt-0.5">{paymentDetails.handle}</p>
                      {paymentDetails.recipientName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Recipient Name: <strong className="text-foreground">{paymentDetails.recipientName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => handleCopyHandle(paymentDetails.handle)}
                        variant="outline"
                        size="sm"
                        className="border-border text-foreground hover:bg-white/5 gap-1.5"
                      >
                        {copiedHandle ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                        {copiedHandle ? 'Copied!' : 'Copy Handle'}
                      </Button>

                      {paymentDetails.payUrl && (
                        <a href={paymentDetails.payUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-primary text-white hover:bg-primary/90 gap-1.5">
                            Open {paymentDetails.name} <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl text-xs text-muted-foreground flex items-start gap-3 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground font-semibold block mb-0.5">Important Memo Note:</strong>
                    {paymentDetails.instructions} Please type <span className="font-mono text-accent font-bold">#{activeOrderNumber}</span> in the payment memo so we can instantly match your payment.
                  </div>
                </div>
              </div>
            </div>

            {/* Proof of Payment Screenshot Upload Section */}
            <div className="bg-background border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent" /> Upload Payment Proof
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload a screenshot or receipt image of your completed payment to verify your order.
                  </p>
                </div>
                {proofUploaded && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proof Received
                  </span>
                )}
              </div>

              {proofUploaded ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Payment Proof Submitted!</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    We have received your payment proof. Our admin team is reviewing your screenshot. Once verified, your order status will be updated to <b>Confirmed</b> and you will receive an email confirmation.
                  </p>
                  {uploadedProofUrl && (
                    <div className="pt-2">
                      <a href={uploadedProofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> View Uploaded Receipt Screenshot
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleUploadProof} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1">Transaction ID / Reference # <span className="text-red-400 font-bold">*</span> <span className="text-[10px] text-muted-foreground">(Required)</span></label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Cash App Ref #, Venmo Txn ID, or Zelle Ref"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="bg-card text-xs border-border focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Sender Name / Cashtag (Optional)</label>
                      <Input
                        type="text"
                        placeholder="e.g. John Doe / $johndoe"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="bg-card text-xs"
                      />
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground block">Payment Screenshot / Receipt Image</label>
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border hover:border-accent/60 rounded-xl cursor-pointer bg-card/50 hover:bg-card transition-all p-4 text-center group">
                      {filePreview ? (
                        <div className="flex items-center gap-4 w-full h-full justify-center">
                          <img src={filePreview} alt="Screenshot Preview" className="h-full max-w-[120px] object-cover rounded-md border border-border" />
                          <div className="text-left text-xs space-y-1">
                            <p className="font-semibold text-white truncate max-w-[200px]">{file?.name}</p>
                            <p className="text-muted-foreground">{((file?.size || 0) / 1024).toFixed(1)} KB</p>
                            <span className="text-accent underline text-[11px]">Click to change image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2.5 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-xs">
                            <span className="font-semibold text-accent">Click to upload</span> or drag & drop screenshot
                          </div>
                          <span className="text-[10px] text-muted-foreground">PNG, JPG, WebP, or PDF (Max 10MB)</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={uploading || (!file && !filePreview) || !transactionId.trim()}
                    className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Proof...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Submit Payment Proof for Verification
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Order Items & Shipping Address Details */}
            <div className="bg-background border border-border rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order Number</p>
                  <p className="font-mono text-xl font-bold text-foreground">{activeOrderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order Status</p>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md flex items-center gap-1 mt-1 justify-end">
                    <Clock className="w-3.5 h-3.5" /> Pending Verification
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
                  {order?.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400 font-medium pt-1">
                      <span>Discount ({order.couponCode || 'Promo'}):</span>
                      <span className="font-mono font-bold">-${Number(order.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-base text-foreground">
                    <span>Total Amount:</span>
                    <span className="text-accent">${order.total?.toFixed(2) ?? '0.00'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
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

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
