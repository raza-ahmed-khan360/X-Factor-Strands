import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Review our returns and refunds policy for research peptides and compounds.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
