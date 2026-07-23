import * as React from 'react';
import { useLocation, Link as WouterLink } from 'wouter';
import { Menu, Search, X, ShieldAlert, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { SearchDialog } from './SearchDialog';

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-border'
            : 'bg-transparent border-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <WouterLink href="/" className="flex items-center group">
              <img src="/logo.png" alt="X Factor Peptides Logo" className="h-28 w-auto object-contain transition-transform group-hover:scale-105" />
            </WouterLink>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
              <ShieldAlert className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-display font-medium text-accent uppercase tracking-wider">
                Research Use Only
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <WouterLink
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  location === link.href ? 'text-accent' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </WouterLink>
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
            
            <WouterLink href="/checkout" className="relative text-secondary hover:text-accent transition-colors group p-2">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground group-hover:bg-accent transition-colors">
                  {totalItems}
                </span>
              )}
            </WouterLink>
            <WouterLink href="/contact" className="border border-secondary text-secondary hover:bg-secondary/10 px-4 py-2 rounded-md text-sm font-medium transition-all">
              Contact
            </WouterLink>
            <WouterLink href="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_15px_rgba(11,95,255,0.3)]">
                Shop
              </Button>
            </WouterLink>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button 
              className="text-foreground hover:text-accent transition-colors" 
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <WouterLink href="/checkout" className="relative text-foreground hover:text-accent transition-colors p-2">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </WouterLink>
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
              <WouterLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium p-2 rounded-md transition-colors',
                  location === link.href ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-white/5'
                )}
              >
                {link.label}
              </WouterLink>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <WouterLink href="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center border border-secondary text-secondary py-3 rounded-md font-medium">
                Contact
              </WouterLink>
              <WouterLink href="/shop" onClick={() => setMobileMenuOpen(false)} className="w-full text-center bg-primary text-white py-3 rounded-md font-medium">
                Shop Research Peptides
              </WouterLink>
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
