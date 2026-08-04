import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the X Factor Peptides team for support, inquiries, or assistance with your research needs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
