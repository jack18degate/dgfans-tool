import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "DGFans Tool — Compound Interest Calculator",
  description: "Calculate compound interest with real-time DeFi pool rates. Visualize your capital growth over time with Turbo Range APRs.",
  openGraph: {
    title: "DGFans Tool — Compound Interest Calculator",
    description: "Calculate compound interest with real-time DeFi pool rates. Visualize your capital growth over time.",
    type: "website",
    siteName: "DGFans",
  },
  twitter: {
    card: "summary_large_image",
    title: "DGFans Tool — Compound Interest Calculator",
    description: "Calculate compound interest with real-time DeFi pool rates.",
  },
  other: {
    "theme-color": "#05060f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
