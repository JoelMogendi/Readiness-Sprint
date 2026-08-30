import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";

// Use Inter font from Google Fonts instead of local files
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reflex — Retailer Operations",
  description: "Team workspace for the Readiness Sprint retailer dashboard.",
  title: "Reflex - Delivery Management",
  description: "A delivery tracking system for retailers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}