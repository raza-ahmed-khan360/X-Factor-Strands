'use client';

import * as React from 'react';
import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Mail, Clock, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { submitContactFormAction } from './actions';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitContactFormAction(form);
      if (res.success) {
        setSubmitted(true);
        toast.success('Your message has been sent to info@xfactorpeps.com!');
      } else {
        toast.error(res.error || 'Failed to send message');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16 mt-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our US support team provides genuine, hands-on support for all our researchers. Send us a message and we will get back to you shortly.
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
                  <h3 className="text-2xl font-display font-bold mb-2">Message Sent Successfully</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Thank you for reaching out. A message has been dispatched to <b>info@xfactorpeps.com</b> and an auto-confirmation was sent to your email.
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
                      <input
                        required
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Last Name</label>
                      <input
                        required
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Wholesale/Bulk Enquiry">Wholesale/Bulk Enquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Message</label>
                    <textarea
                      required
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                      placeholder="How can we help with your research enquiry?"
                    ></textarea>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-10 lg:pt-4">
              <div>
                <h3 className="text-2xl font-display font-bold mb-8">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">Email Us</h4>
                      <p className="text-muted-foreground mt-1 mb-1">Direct support for all enquiries.</p>
                      <a href="mailto:info@xfactorpeps.com" className="text-accent hover:underline font-medium text-base">
                        info@xfactorpeps.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">Business Hours (US)</h4>
                      <p className="text-muted-foreground mt-1">Monday - Friday: 9am - 5pm EST</p>
                      <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-accent">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">Location</h4>
                      <p className="text-muted-foreground mt-1">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-6 bg-card border border-border rounded-2xl space-y-2">
                <h4 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Fast Support Response
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All messages sent through this contact form are delivered directly to our <b>info@xfactorpeps.com</b> inbox. We strive to answer all research enquiries within 2-4 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
