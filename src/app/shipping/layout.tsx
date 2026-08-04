import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about our shipping methods, delivery times, and dispatch processes for all research product orders.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
