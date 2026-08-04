import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Research Peptides",
  description: "Browse our extensive catalog of high-quality research peptides, verified for purity and effectiveness.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
