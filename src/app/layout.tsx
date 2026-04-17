import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import MouseSpotlight from "@/components/MouseSpotlight";
import { ProgressProvider } from "@/context/ProgressContext";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });

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
      <body className={`${inter.variable} ${vt323.variable} ${inter.className}`}>
        <QueryProvider>
          <ProgressProvider>
            <div className="app-container">
              <div style={{ 
                position: 'fixed', top: 0, left: 250, right: 0, bottom: 0, zIndex: -1, 
                backgroundImage: "url('/landscape.png')", backgroundSize: "cover", 
                backgroundPosition: "bottom center" 
              }} />
              <MouseSpotlight />
              <Navigation />
              <main className="main-content">
                {children}
              </main>
            </div>
          </ProgressProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
