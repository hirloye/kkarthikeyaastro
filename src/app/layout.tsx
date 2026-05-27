import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { Toaster } from "react-hot-toast";
import GlobalScrollObserver from "@/components/GlobalScrollObserver";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kkarthikeya Astrological Centre | Best Astrologer in Chennai, Tamilnadu",
  description: "Get highly accurate and personalized Vedic astrology consultation, Marriage Matching, Kadikara Prasannam, and Muhurtham auspicious timing consultation by expert astrologer Kkarthikeya in Chennai, Tamilnadu.",
  keywords: [
    "Astrologer in Chennai",
    "Best Astrologer in Tamilnadu",
    "Vedic Astrology Chennai",
    "Marriage Matching Tamilnadu",
    "Muhurtham Consultation Chennai",
    "Kkarthikeya Astrological Centre",
    "Kadikara prasannam",
    "House warming Muhurtham timing",
    "C-Section delivery timing"
  ],
  icons: {
    icon: "/assets/KK_Logo.png",
    shortcut: "/assets/KK_Logo.png",
    apple: "/assets/KK_Logo.png",
  },
  openGraph: {
    title: "Kkarthikeya Astrological Centre",
    description: "Personalized traditional Vedic astrology guidance, horoscope analysis, and auspicious Muhurtham scheduling in Chennai.",
    images: ["/assets/astrologer.png?v=2"],
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Kkarthikeya Astrological Centre",
    "image": "https://astro-kkarthikeya.com/assets/astrologer.png?v=2",
    "@id": "https://astro-kkarthikeya.com/#website",
    "url": "https://astro-kkarthikeya.com",
    "telephone": "+918344874681",
    "priceRange": "INR",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nungambakkam",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600034",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.0604,
      "longitude": 80.2496
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.facebook.com/kkarthikeyaastro",
      "https://www.instagram.com/kkarthikeyaastro"
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-amber-500/20 selection:text-amber-200">
        {/* Schema Markup for Local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <AppProvider>
          {/* Global Scroll Animation Observer */}
          <GlobalScrollObserver />
          
          {/* Global Floating Header */}
          <Header />
          
          {/* Main App Container with appropriate top padding for fixed header */}
          <main className="flex-1 w-full flex flex-col pt-20">
            {children}
          </main>
          
          {/* Global Footer */}
          <Footer />

          {/* Floating Action Elements */}
          <FloatingActions />
          
          <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
        </AppProvider>
      </body>
    </html>
  );
}
