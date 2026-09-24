import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ZubPratilac from "@/components/pratilac/ZubPratilac";

export const metadata: Metadata = {
  metadataBase: new URL("https://dentifid.rs"),
  title: "DentifID — procena hitnosti stomatološkog problema",
  description:
    "Kratak upitnik o problemu sa zubima daje procenu hitnosti i predlog specijaliste. Besplatna Android aplikacija na srpskom.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "https://dentifid.rs/",
    title: "DentifID — procena hitnosti stomatološkog problema",
    description:
      "Kratak upitnik o problemu sa zubima daje procenu hitnosti i predlog specijaliste. Besplatna Android aplikacija na srpskom.",
    images: [{ url: "/img/og-dentifid.png", width: 1024, height: 500 }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/img/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f7fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn-RS">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-400-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="podloga" aria-hidden="true" />
        <SmoothScroll />
        <a className="preskoci" href="#sadrzaj">
          Preskočite na sadržaj
        </a>
        <Header />
        <main id="sadrzaj">{children}</main>
        <Footer />
        <ZubPratilac />
      </body>
    </html>
  );
}
