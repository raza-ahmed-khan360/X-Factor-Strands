import * as React from 'react';
import { Link } from 'wouter';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border relative z-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center group mb-6 inline-flex">
              <img src="/logo.jpg" alt="X Factor Peptides Logo" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium quality research peptides for laboratory and scientific use, backed by rigorous verification standards.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-6">Research Areas</h3>
            <ul className="space-y-3">
              {[
                'Weight Management',
                'Recovery',
                'Performance',
                'Sleep',
                'Focus & Cognitive',
                'Energy',
              ].map((area) => (
                <li key={area}>
                  <Link href="/shop" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                    {area} Research
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact', href: '/contact' },
                { label: 'Careers', href: '/about' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-6">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to receive updates on new research products and stock availability.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-full"
              />
              <button
                type="submit"
                className="bg-secondary text-white text-sm font-medium py-2 rounded-md hover:bg-secondary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2026 X Factor Peptides Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Shipping', href: '/shipping' },
              { label: 'Returns', href: '/returns' },
              { label: 'Research Disclaimer', href: '/research-disclaimer' },
            ].map((link) => (
               <Link key={link.label} href={link.href} className="text-muted-foreground text-xs hover:text-accent transition-colors">
                 {link.label}
               </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 p-4 bg-background border border-accent/20 rounded-md text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            All products are strictly for laboratory research purposes only. Not intended for human consumption.
          </p>
        </div>
      </div>
    </footer>
  );
}
