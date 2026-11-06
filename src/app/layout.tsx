import type { Metadata } from "next";
import { Atkinson_Hyperlegible, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ProgressProvider } from "@/context/ProgressContext";
import QueryProvider from "@/components/QueryProvider";

const body = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });
const hud = VT323({ weight: "400", subsets: ["latin"], variable: "--font-hud" });

export const metadata: Metadata = {
  title: { default: "codedash: Critical thinking", template: "%s · codedash" },
  description: "Trace a change in the code, then say why the result follows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${hud.variable} ${mono.variable} ${body.className}`}>
        <QueryProvider>
          <ProgressProvider>
            <div className="app-container">
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
