const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'shop', title: 'Shop Research Peptides', desc: 'Browse our extensive catalog of high-quality research peptides, verified for purity and effectiveness.' },
  { path: 'about', title: 'About Us', desc: 'Learn more about X Factor Peptides, our mission, and our commitment to providing the highest quality research compounds.' },
  { path: 'contact', title: 'Contact Us', desc: 'Get in touch with the X Factor Peptides team for support, inquiries, or assistance with your research needs.' },
  { path: 'faq', title: 'Frequently Asked Questions', desc: 'Find answers to common questions about our research peptides, shipping, ordering, and more.' },
  { path: 'terms', title: 'Terms of Service', desc: 'Read the Terms of Service for using X Factor Peptides. All products are strictly for laboratory research purposes.' },
  { path: 'privacy', title: 'Privacy Policy', desc: 'Read our Privacy Policy to understand how we collect, use, and protect your personal information.' },
  { path: 'shipping', title: 'Shipping Policy', desc: 'Learn about our shipping methods, delivery times, and dispatch processes for all research product orders.' },
  { path: 'returns', title: 'Returns & Refunds', desc: 'Review our returns and refunds policy for research peptides and compounds.' },
  { path: 'research-disclaimer', title: 'Research Disclaimer', desc: 'Important research disclaimer: All products sold are strictly for in-vitro laboratory research purposes only.' }
];

const template = (title, desc) => `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "${desc}",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

pages.forEach(page => {
  const dirPath = path.join(__dirname, 'src', 'app', page.path);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'layout.tsx');
  fs.writeFileSync(filePath, template(page.title, page.desc));
  console.log(`Created ${filePath}`);
});
