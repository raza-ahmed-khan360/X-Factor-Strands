import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Disclaimer",
  description: "Important research disclaimer: All products sold are strictly for in-vitro laboratory research purposes only.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
