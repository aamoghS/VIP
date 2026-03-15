import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ProgressProvider } from "@/context/ProgressContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIP - Middle School Coding Platform",
  description: "Learn to code by solving real-world problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressProvider>
          <div className="app-container">
            <Navigation />
            <main className="main-content">
              {children}
            </main>
          </div>
        </ProgressProvider>
      </body>
    </html>
  );
}
