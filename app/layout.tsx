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
  title: "FaireDesDevis — Devis professionnels en 60 secondes pour artisans",
  description: "Créez vos devis professionnels en 60 secondes grâce à l'IA. Signature électronique légale, facturation en 1 clic. Pour artisans, plombiers, électriciens, menuisiers et indépendants. Essai gratuit 7 jours.",
  keywords: [
    "devis artisan",
    "logiciel devis artisan",
    "créer devis professionnel",
    "devis plombier",
    "devis électricien",
    "devis menuisier",
    "devis en ligne",
    "signature électronique devis",
    "facturation artisan",
    "logiciel facturation artisan",
    "devis gratuit artisan",
    "application devis artisan",
    "devis rapide artisan",
    "faire un devis",
    "devis auto entrepreneur",
  ],
  authors: [{ name: "FaireDesDevis", url: "https://fairedesdevis.fr" }],
  creator: "FaireDesDevis",
  publisher: "FaireDesDevis",
  metadataBase: new URL("https://fairedesdevis.fr"),
  alternates: {
    canonical: "https://fairedesdevis.fr",
  },
  openGraph: {
    title: "FaireDesDevis — Devis professionnels en 60 secondes",
    description: "Créez vos devis professionnels en 60 secondes grâce à l'IA. Signature électronique légale, facturation en 1 clic. Essai gratuit 7 jours.",
    url: "https://fairedesdevis.fr",
    siteName: "FaireDesDevis",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://fairedesdevis.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "FaireDesDevis — Devis professionnels en 60 secondes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FaireDesDevis — Devis professionnels en 60 secondes",
    description: "Créez vos devis professionnels en 60 secondes grâce à l'IA. Essai gratuit 7 jours.",
    images: ["https://fairedesdevis.fr/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "", // Ajoutez votre code Google Search Console ici
  },
}

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
        <link rel="canonical" href="https://fairedesdevis.fr" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}