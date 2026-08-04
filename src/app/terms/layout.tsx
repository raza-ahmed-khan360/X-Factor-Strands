import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for using X Factor Peptides. All products are strictly for laboratory research purposes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
