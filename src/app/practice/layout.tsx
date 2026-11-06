import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice",
  description: "Change one line in your head, pick what happens, then say why.",
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
