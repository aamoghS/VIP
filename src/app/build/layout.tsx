import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build",
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return children;
}
