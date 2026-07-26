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
  title: "FaireDesDevis — Devis pro en 60 secondes",
  description: "Créez vos devis en 60 secondes. Signature électronique légale, facturation en 1 clic. 7 jours gratuits.",
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
    title: "FaireDesDevis — Devis pro en 60 secondes",
    description: "Créez vos devis en 60 secondes. Signature électronique légale, facturation en 1 clic. 7 jours gratuits.",
    url: "https://fairedesdevis.fr",
    siteName: "FaireDesDevis",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://fairedesdevis.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "FaireDesDevis — Devis pro en 60 secondes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FaireDesDevis — Devis pro en 60 secondes",
    description: "Créez vos devis en 60 secondes. Signature électronique légale. 7 jours gratuits.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FaireDesDevis",
              "url": "https://fairedesdevis.fr",
              "description": "Créez vos devis en 60 secondes. Signature électronique légale, facturation en 1 clic.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "24.99",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "description": "7 jours gratuits puis 24,99€/mois"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}