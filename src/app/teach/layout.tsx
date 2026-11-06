import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teach",
};

export default function TeachLayout({ children }: { children: React.ReactNode }) {
  return children;
}
