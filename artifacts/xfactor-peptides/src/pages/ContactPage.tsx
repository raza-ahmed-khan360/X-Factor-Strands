import * as React from 'react';
import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Mail, Phone, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team provides genuine, hands-on support for all our researchers. Send us a message and a real person will get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="bg-card p-8 md:p-10 rounded-2xl border border-border">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Message Sent</h3>
                  <p className="text-muted-foreground mb-8">
                    Thank you for reaching out. A member of our support team will respond to your enquiry within a few hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">First Name</label>
                      <input required type="text" className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Last Name</label>
                      <input required type="text" className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Email Address</label>
                    <input required type="email" className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="john@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Subject</label>
                    <select className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-foreground">
                      <option>General Enquiry</option>
                      <option>Order Support</option>
                      <option>Product Information</option>
                      <option>Wholesale/Bulk Enquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Message</label>
                    <textarea required rows={5} className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg">
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-10 lg:pt-8">
              <div>
                <h3 className="text-2xl font-display font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">Email Us</h4>
                      <p className="text-muted-foreground mt-1 mb-1">Our primary support channel.</p>
                      <a href="mailto:info@xfactorpeptides.com" className="text-secondary hover:underline font-medium">info@xfactorpeptides.com</a>
                    </div>
                  </div>



                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">Business Hours</h4>
                      <p className="text-muted-foreground mt-1">Monday - Friday: 9am - 5pm GMT</p>
                      <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-48 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
                 <div className="absolute inset-0" style={{
                   backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                   backgroundSize: '20px 20px'
                 }} />
                 <MapPin className="w-8 h-8 text-accent mb-2 relative z-10" />
                 <span className="font-display font-medium text-foreground relative z-10">United States</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
