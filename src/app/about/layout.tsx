import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about X Factor Peptides, our mission, and our commitment to providing the highest quality research compounds.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
