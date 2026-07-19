import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaireDesDevis — Devis professionnels en 60 secondes",
  description: "Créez vos devis professionnels en 60 secondes grâce à l'IA. Signature électronique légale, facturation en 1 clic. Pour artisans, plombiers, électriciens et indépendants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}