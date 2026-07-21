import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  content: React.ReactNode;
}

export default function PolicyPage({ title, lastUpdated, content }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="mt-8 mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">{title}</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
            {content}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Export pre-configured policy pages

export const ShippingPolicyPage = () => (
  <PolicyPage
    title="Shipping Policy"
    lastUpdated="March 2026"
    content={
      <>
        <h2>Dispatch Times</h2>
        <p>We aim to dispatch all orders placed before 2:00 PM GMT on the same business day. Orders placed after this time or on weekends/public holidays will be dispatched on the next business day.</p>
        
        <h2>Delivery Options</h2>
        <p>We offer the following delivery options within the USA:</p>
        <ul>
          <li><strong>Standard Tracked:</strong> 2-3 business days ($4.99)</li>
          <li><strong>Express Tracked:</strong> 1-2 business days ($7.99)</li>
          <li><strong>Free Shipping:</strong> Available on orders over $150</li>
        </ul>
        
        <h2>Packaging</h2>
        <p>All research products are packaged securely and discreetly to ensure their integrity during transit. Temperature-sensitive items are packaged appropriately to maintain stability.</p>
      </>
    }
  />
);

export const ReturnsPolicyPage = () => (
  <PolicyPage
    title="Returns Policy"
    lastUpdated="March 2026"
    content={
      <>
        <h2>Return Conditions</h2>
        <p>Due to the sensitive nature of research compounds, we can only accept returns for items that arrive damaged, defective, or incorrect. We cannot accept returns of opened or altered products.</p>
        
        <h2>Process</h2>
        <p>If you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery. Include your order number and photographic evidence of the issue. We will arrange a replacement or refund promptly.</p>
        
        <h2>Refunds</h2>
        <p>Approved refunds will be processed to the original payment method within 5-7 business days of the returned item being received and inspected by our facility.</p>
      </>
    }
  />
);

export const PrivacyPolicyPage = () => (
  <PolicyPage
    title="Privacy Policy"
    lastUpdated="March 2026"
    content={
      <>
        <h2>Data Collection</h2>
        <p>We collect necessary information to process orders and provide customer support, including name, shipping address, email address, and payment details. We do not store full credit card information on our servers.</p>
        
        <h2>Data Usage</h2>
        <p>Your information is used strictly for order fulfillment, customer communication, and regulatory compliance. We do not sell or share your personal information with third-party marketing agencies.</p>
        
        <h2>Security</h2>
        <p>We employ industry-standard encryption and security measures to protect your data during transmission and storage.</p>
      </>
    }
  />
);

export const TermsPage = () => (
  <PolicyPage
    title="Terms of Service"
    lastUpdated="March 2026"
    content={
      <>
        <h2>Agreement</h2>
        <p>By accessing or using the X Factor Peptides website, you agree to be bound by these Terms of Service. If you do not agree to all terms, you must not use this website.</p>
        
        <h2>User Requirements</h2>
        <p>You must be at least 18 years of age and a qualified researcher or representing a research institution to purchase products from this site. By purchasing, you represent and warrant that you meet these criteria.</p>
        
        <h2>Product Use</h2>
        <p>You agree to adhere strictly to our Research Use Only policy. Any suspected violation of this policy will result in immediate cancellation of orders and termination of your account without notice.</p>
      </>
    }
  />
);
