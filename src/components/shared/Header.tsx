"use client";
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, Search, X, ShieldAlert, ShoppingCart, Tag, Copy, Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { SearchDialog } from './SearchDialog';

// Promotional Coupons to highlight in top header
const PROMO_ITEMS = [
  {
    code: 'WELCOME10',
    badge: '1ST-TIME BUYER',
    text: 'Get 10% OFF your first research order!',
    highlight: '10% OFF',
  },
  {
    code: 'FIRST20',
    badge: 'NEW CUSTOMER',
    text: 'Get 20% OFF on all qualifying orders!',
    highlight: '20% OFF',
  },
  {
    code: 'RESEARCH20',
    badge: 'BULK SAVINGS',
    text: 'Take $20.00 OFF orders over $150!',
    highlight: '$20 OFF',
  },
];

export function Header() {
  const location = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [activePromoIdx, setActivePromoIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate promo items every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromoIdx((prev) => (prev + 1) % PROMO_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const navLinks = [
    { href: '/shop', label: 'Products' },
    { href: '/COAS', label: 'COAs' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  const activePromo = PROMO_ITEMS[activePromoIdx];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-border shadow-xl shadow-black/40'
            : 'bg-background/90 backdrop-blur-sm border-border/50'
        )}
      >
        {/* Top Promo Announcement Bar */}
        {showPromoBanner && (
          <div className="bg-gradient-to-r from-accent/90 via-primary/95 to-accent/90 text-white text-xs sm:text-sm py-2 px-3 sm:px-6 border-b border-white/10 relative overflow-hidden shadow-inner">
            <div className="container mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden flex-1 justify-center sm:justify-start">
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-bold text-amber-300 border border-amber-400/30 shrink-0 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  {activePromo.badge}
                </span>

                <div className="flex items-center gap-1.5 truncate">
                  <Tag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate text-foreground/90 font-medium">
                    {activePromo.text}
                  </span>
                  <span className="hidden md:inline text-muted-foreground text-xs">Use Code:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activePromo.code)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 hover:bg-black/70 text-amber-300 font-mono font-bold border border-amber-400/40 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    title="Click to copy promo code"
                  >
                    {activePromo.code}
                    {copiedCode === activePromo.code ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-amber-300/80" />
                    )}
                  </button>

                  {copiedCode === activePromo.code && (
                    <span className="text-[11px] text-emerald-300 font-bold animate-in fade-in shrink-0">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/shop"
                  className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-amber-200 underline underline-offset-2 transition-colors"
                >
                  Shop Now & Save
                </Link>

                <button
                  type="button"
                  onClick={() => setShowPromoBanner(false)}
                  className="p-1 rounded hover:bg-black/30 text-white/80 hover:text-white transition-colors"
                  aria-label="Close promo banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center group">
              <img src="/logo.png" alt="X Factor Peptides Logo" className="h-22 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
              <ShieldAlert className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-display font-medium text-accent uppercase tracking-wider">
                Research Use Only
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  location === link.href ? 'text-accent' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              className="text-secondary hover:text-accent transition-colors" 
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/checkout" className="relative text-secondary hover:text-accent transition-colors group p-2">
              <ShoppingCart className="w-5 h-5"/>
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground group-hover:bg-accent transition-colors">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/contact" className="border border-secondary text-secondary hover:bg-secondary/10 px-4 py-2 rounded-md text-sm font-medium transition-all">
              Contact
            </Link>
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_15px_rgba(11,95,255,0.3)]">
                Shop
              </Button>
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button 
              className="text-foreground hover:text-accent transition-colors" 
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/checkout" className="relative text-foreground hover:text-accent transition-colors p-2">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-background border-b border-border shadow-xl py-4 px-4 flex flex-col gap-4">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-accent/30 bg-accent/5 w-fit">
              <ShieldAlert className="w-4 h-4 text-accent" />
              <span className="text-xs font-display font-medium text-accent uppercase tracking-wider">
                Research Use Only
              </span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium p-2 rounded-md transition-colors',
                  location === link.href ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center border border-secondary text-secondary py-3 rounded-md font-medium">
                Contact
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="w-full text-center bg-primary text-white py-3 rounded-md font-medium">
                Shop Research Peptides
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
