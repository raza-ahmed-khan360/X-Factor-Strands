'use client';

import * as React from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { CheckCircle2, X, ShoppingBag, ArrowRight } from 'lucide-react';

export interface CartAlertProps {
  productName: string;
  size?: string;
  price?: number;
  imageUrl?: string;
}

export function showCartAlert({ productName, size, price }: CartAlertProps) {
  toast.custom((t) => (
    <div
      role="alert"
      className="w-full max-w-sm sm:max-w-md bg-[#0a121e] border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-950/60 text-foreground flex items-start gap-3.5 backdrop-blur-2xl animate-in slide-in-from-top-4 fade-in-50 duration-300 relative overflow-hidden pointer-events-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(8, 16, 28, 0.97) 0%, rgba(12, 22, 40, 0.98) 100%)',
      }}
    >
      {/* Top Brand Accent Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

      {/* Brand Severity Icon (Vivid Cyan) */}
      <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-sm shadow-cyan-500/20">
        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
      </div>

      {/* Content Body */}
      <div className="flex-grow min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-display">
            Added to Cart
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <h4 className="text-sm font-display font-bold text-white truncate">
          {productName}
        </h4>
        <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
          {size && (
            <span className="text-cyan-200 font-medium bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20 text-[11px] font-mono">
              {size}
            </span>
          )}
          {price !== undefined && (
            <span className="text-accent font-bold font-mono text-xs">
              ${price.toFixed(2)}
            </span>
          )}
        </p>

        {/* Action Buttons (Brand Primary & Secondary) */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href="/checkout"
            onClick={() => toast.dismiss(t)}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold font-display tracking-wide transition-all shadow-[0_0_15px_rgba(11,95,255,0.4)] hover:scale-105"
          >
            Checkout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/shop"
            onClick={() => toast.dismiss(t)}
            className="inline-flex items-center gap-1 bg-card hover:bg-card/80 text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-accent/40 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-accent" /> View Shop
          </Link>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => toast.dismiss(t)}
        className="text-muted-foreground hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
        aria-label="Close Alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ), {
    duration: 4500,
    position: 'top-right',
  });
}
