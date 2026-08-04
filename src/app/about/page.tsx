"use client";
import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ShieldCheck, HeartHandshake, Eye, Medal } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="bg-card border-b border-border py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-particle opacity-50" />
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl relative z-10">
            <span className="eyebrow mb-4 inline-block">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">About X Factor Peptides</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Setting a new standard for quality and transparency in the US research peptide industry.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 mt-16 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="font-display text-3xl font-bold text-foreground">The Origins</h2>
            <p>
              Founded in 2026, X Factor Peptides was established with a singular vision: to provide the US research community with access to genuinely high-quality research compounds, backed by a level of customer service that the industry was previously lacking.
            </p>
            <p>
              We observed that the market was dominated by faceless, automated suppliers where researchers were treated as mere order numbers. When questions arose or guidance was needed regarding compound specifications, researchers were often met with automated responses or silence.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mt-12">Why We're Different</h2>
            <p>
              We operate differently. At X Factor Peptides, we believe that serious research deserves a serious supply partner. We take a hands-on approach to every aspect of our business — from rigorously verifying the purity of our catalogue to personally packing each order.
            </p>
            <p>
              When you contact us, you speak to a real person who understands our products and respects your research goals. We don't hide behind automated systems.
            </p>
          </div>
        </div>

        <div className="bg-card border-y border-border mt-24 py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Our Core Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "Uncompromising Quality", desc: "Every compound in our catalogue undergoes strict verification to ensure it meets our rigorous purity standards (>98%). We do not compromise on the quality of research materials." },
                { icon: Eye, title: "Absolute Transparency", desc: "We are clear about what our products are, and more importantly, what they are not. Our commitment to 'Research Use Only' is unwavering and central to our ethical operation." },
                { icon: HeartHandshake, title: "Personal Service", desc: "We treat every researcher as an individual. Our support team provides genuine, human responses and takes pride in resolving enquiries swiftly and professionally." },
                { icon: Medal, title: "Scientific Integrity", desc: "We respect the scientific process. We provide accurate specifications without hyperbole, allowing researchers to make informed decisions for their laboratory work." }
              ].map((val, i) => (
                <div key={i} className="bg-background border border-border p-8 rounded-xl flex gap-6 group hover:border-accent/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-3">{val.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
