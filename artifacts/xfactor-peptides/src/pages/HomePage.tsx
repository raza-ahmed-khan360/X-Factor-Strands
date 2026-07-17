import * as React from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { TheStrand } from '@/components/shared/TheStrand';
import { VialIllustration } from '@/components/illustrations/VialIllustration';
import { ProductCard, productData, AbstractMoleculeIcon } from '@/components/products/ProductData';
import { FlaskConical, Microscope, Zap, Headset, ShieldCheck, ArrowRight, CheckCircle2, ChevronDown, Activity, Brain, Moon, Dumbbell, Droplet, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'products', label: 'Products' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'trust', label: 'Trust' },
  { id: 'mission', label: 'Mission' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30">
      <Header />
      <TheStrand sections={SECTIONS} />
      
      <main className="md:pl-32 lg:pl-48">
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[100dvh] relative flex items-center pt-20 pb-12 overflow-hidden bg-particle border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <span className="eyebrow inline-block">Premium Research Peptides</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white">
                  Research Peptides <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">You Can Trust</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Premium quality research peptides backed by exceptional customer support and a genuinely hands-on approach to every order.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/shop">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto text-lg h-14 px-8 shadow-[0_0_20px_rgba(11,95,255,0.4)] hover:scale-[1.03] transition-all">
                      Shop Research Peptides
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto text-lg h-14 px-8">
                      Contact Our Team
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wide mt-4">
                  For laboratory research purposes only. Not for human consumption.
                </p>
              </div>
              <div className="flex-1 w-full max-w-lg lg:max-w-none">
                <VialIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-[#E7ECF3] border-b border-border py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-center md:text-left">
              {[
                { icon: FlaskConical, label: 'High Purity Standards' },
                { icon: Microscope, label: 'Research Use Only' },
                { icon: Zap, label: 'Fast Dispatch' },
                { icon: Headset, label: 'Personal Support' },
                { icon: ShieldCheck, label: 'Secure Ordering' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <item.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                  <span className="font-display font-medium text-sm text-background/80 group-hover:text-background transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 bg-background relative border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <span className="eyebrow">The X Factor Approach</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Research-Driven.<br/>Customer-Focused.</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-sans">
                <p>
                  Founded in 2026, X Factor Peptides was established to bring high-quality research compounds to serious researchers across the UK.
                </p>
                <p>
                  Unlike large automated operations where you're just an order number, we give every customer genuine personal attention. We believe that quality research deserves quality products—and quality people behind them.
                </p>
                <p>
                  With rigorous quality-verified products, transparent practices, and a team that genuinely cares about your research outcomes, we are building the new standard for research peptide supply.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/about">
                  <Button variant="outline" className="border-border hover:bg-white/5 hover:text-accent h-12 px-8">
                    Learn More About Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH CATEGORIES */}
        <section id="research" className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="eyebrow">Explore By Field</span>
              <h2 className="text-4xl font-display font-bold text-white mt-4">Explore Research Areas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Weight Management', icon: Activity, desc: 'Peptide compounds studied for metabolic pathways and lipid regulation in laboratory settings.' },
                { title: 'Recovery Research', icon: Dumbbell, desc: 'Research compounds exploring tissue repair mechanisms and cellular regeneration processes.' },
                { title: 'Performance', icon: Zap, desc: 'Laboratory peptides studied for their effects on muscular and physical performance markers.' },
                { title: 'Sleep Research', icon: Moon, desc: 'Compounds investigated for their role in circadian rhythm regulation and sleep architecture.' },
                { title: 'Focus & Cognitive', icon: Brain, desc: 'Peptides studied for neurological pathways associated with cognitive function and focus.' },
                { title: 'Energy Research', icon: Battery, desc: 'Research compounds explored for their role in mitochondrial function and energy metabolism.' },
              ].map((cat, i) => (
                <div key={i} className="bg-background border border-border rounded-xl p-8 group hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{cat.desc}</p>
                  <Link href="/shop" className="text-secondary font-medium text-sm flex items-center hover:text-accent transition-colors">
                    Explore <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/shop">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-10 shadow-lg shadow-primary/20">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section id="why-us" className="py-24 bg-background overflow-hidden border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 w-full relative">
                {/* Abstract Molecular Illustration */}
                <div className="aspect-square max-w-md mx-auto relative group">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-[80px]" />
                  <svg className="w-full h-full relative z-10 text-border" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Hexagonal Lattice Grid */}
                    <path d="M200 50 L330 125 L330 275 L200 350 L70 275 L70 125 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M200 110 L280 155 L280 245 L200 290 L120 245 L120 155 Z" stroke="currentColor" strokeWidth="2" />
                    
                    {/* Connectors */}
                    <line x1="200" y1="50" x2="200" y2="110" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="330" y1="125" x2="280" y2="155" stroke="#2F5FFF" strokeWidth="3" />
                    <line x1="330" y1="275" x2="280" y2="245" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="200" y1="350" x2="200" y2="290" stroke="#2F5FFF" strokeWidth="3" />
                    <line x1="70" y1="275" x2="120" y2="245" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="70" y1="125" x2="120" y2="155" stroke="#2F5FFF" strokeWidth="3" />

                    {/* Nodes */}
                    <circle cx="200" cy="50" r="8" fill="#22D3EE" className="animate-pulse" />
                    <circle cx="330" cy="125" r="6" fill="#2F5FFF" />
                    <circle cx="330" cy="275" r="8" fill="#22D3EE" className="animate-pulse" />
                    <circle cx="200" cy="350" r="6" fill="#2F5FFF" />
                    <circle cx="70" cy="275" r="8" fill="#22D3EE" className="animate-pulse" />
                    <circle cx="70" cy="125" r="6" fill="#2F5FFF" />
                    
                    {/* Inner Nodes */}
                    <circle cx="200" cy="110" r="5" fill="#fff" />
                    <circle cx="280" cy="155" r="5" fill="#fff" />
                    <circle cx="280" cy="245" r="5" fill="#fff" />
                    <circle cx="200" cy="290" r="5" fill="#fff" />
                    <circle cx="120" cy="245" r="5" fill="#fff" />
                    <circle cx="120" cy="155" r="5" fill="#fff" />
                    <circle cx="200" cy="200" r="12" fill="url(#coreGlow)" />
                    
                    <defs>
                      <radialGradient id="coreGlow">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#2F5FFF" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <span className="eyebrow">Why Choose Us</span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">The X Factor Difference</h2>
                </div>
                <div className="space-y-6">
                  {[
                    { title: 'Hands-On Customer Service', desc: 'Real people, real answers. Every customer gets personal attention.' },
                    { title: 'Premium Quality Standards', desc: 'Rigorous quality verification on every product in our catalogue.' },
                    { title: 'Research Focused', desc: 'Products and information curated specifically for serious researchers.' },
                    { title: 'Fast Support', desc: 'Quick, knowledgeable responses to your enquiries, every time.' },
                    { title: 'Growing Community', desc: 'A community of researchers who value quality and transparency.' },
                    { title: 'Simple Ordering', desc: 'Straightforward, secure ordering process from browsing to delivery.' },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className={cn("w-6 h-6", i === 0 ? "text-accent" : (i % 2 === 0 ? "text-secondary" : "text-primary"))} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-lg">{feat.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section id="products" className="py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="eyebrow">Our Catalogue</span>
                <h2 className="text-4xl font-display font-bold mt-4">Featured Research Products</h2>
              </div>
              <Link href="/shop" className="hidden md:flex text-secondary hover:text-accent font-medium items-center transition-colors">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productData.map(product => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
            <div className="mt-8 md:hidden text-center">
               <Link href="/shop">
                 <Button variant="outline" className="w-full">View All Products</Button>
               </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-card border-b border-border relative">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold">Simple. Reliable. Research-Ready.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border">
                <div className="h-full bg-accent/50 w-full animate-pulse-slow" />
              </div>
              
              {[
                { num: '1', title: 'Browse Research Products', desc: 'Explore our catalogue of research peptides, organised by research area.' },
                { num: '2', title: 'Place Your Order', desc: 'Simple, secure checkout process with multiple payment options.' },
                { num: '3', title: 'Receive Your Products', desc: 'Fast dispatch, tracked delivery, and personal support throughout.' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-background border-2 border-accent flex items-center justify-center text-3xl font-display font-bold text-accent shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-6">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="trust" className="py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="eyebrow">Community</span>
              <h2 className="text-4xl font-display font-bold mt-4">Trusted by Researchers</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { quote: "Excellent service. My order arrived quickly and was exactly as described. The customer support team answered all my questions thoroughly.", author: "Dr. A.M.", title: "Research Scientist" },
                  { quote: "Finally a supplier that treats customers as individuals. I had questions before ordering and got a genuine, knowledgeable response within the hour.", author: "James T.", title: "Laboratory Researcher" },
                  { quote: "High quality products and fast shipping. I appreciate the transparency around research-only use — it's clearly stated throughout.", author: "Sarah K.", title: "PhD Student" },
                  { quote: "Ordering was simple and delivery was prompt. Will definitely be ordering again for ongoing research.", author: "Michael R.", title: "Independent Researcher" },
                ].map((t, i) => (
                  <div key={i} className="bg-card p-8 rounded-xl border border-border flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-accent">★</span>)}
                    </div>
                    <p className="text-foreground/90 italic mb-6 flex-grow">"{t.quote}"</p>
                    <div>
                      <p className="font-display font-semibold">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MISSION STATEMENT */}
        <section id="mission" className="py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Our Mission</h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans font-light">
                "At X Factor Peptides, our mission is to provide researchers with access to premium quality research compounds, supported by transparent practices and genuinely personal customer service. We believe that quality research deserves quality products — and quality people behind them. Every order we fulfil reflects our commitment to the researchers who trust us."
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Are your products for research purposes only?", a: "Yes. All products sold by X Factor Peptides are strictly for laboratory and scientific research purposes only. They are not intended for human consumption, veterinary use, or any other purpose." },
                { q: "How are products shipped?", a: "We dispatch all orders promptly using tracked courier services. Orders are packaged securely and discreetly." },
                { q: "How do I contact support?", a: "You can reach our team via the Contact page, by email, or by phone. We aim to respond to all enquiries within a few hours during business hours." },
                { q: "What payment methods do you accept?", a: "We accept major credit and debit cards and bank transfer. All transactions are processed securely." },
                { q: "How long does shipping take?", a: "Standard delivery typically takes 2-3 business days within the UK. Express options are available at checkout." },
              ].map((faq, i) => (
                <details key={i} className="group bg-background border border-border rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-medium text-lg list-none group-open:border-l-4 group-open:border-l-accent transition-all">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-muted-foreground border-l-4 border-l-accent bg-background">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Need Help Choosing the Right Research Products?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Our team is here to help. Whether you have questions about specific research compounds or need guidance on what might suit your research, get in touch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto text-lg h-14 px-10">
                  Contact Us
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto text-lg h-14 px-10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
