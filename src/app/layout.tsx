import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import MouseSpotlight from "@/components/MouseSpotlight";
import { ProgressProvider } from "@/context/ProgressContext";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "codedash - Middle School Coding Platform",
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
        <QueryProvider>
          <AuthProvider>
            <ProgressProvider>
              <div className="app-container">
                <MouseSpotlight />
                <Navigation />
                <main className="main-content">
                  {children}
                </main>
              </div>
            </ProgressProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
