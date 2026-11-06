import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Score",
};

export default function ScoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
