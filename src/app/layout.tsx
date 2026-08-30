import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

// Use Inter font from Google Fonts instead of local files
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reflex — Retailer Operations",
  description: "Team workspace for the Readiness Sprint retailer dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Navbar />
        {/* The main content of your pages will render here */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}