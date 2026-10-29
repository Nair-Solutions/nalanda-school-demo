import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title:
    "Nalanda English Medium Hr. Sec. School, Bhilai | नालंदा इंग्लिश मीडियम हायर सेकेंडरी स्कूल",
  description:
    "Choose English or Hindi to continue to the website of Nalanda English Medium Higher Secondary School, Bhilai. अंग्रेज़ी या हिन्दी चुनें।",
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/en", "hi-IN": "/hi", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    title: "Nalanda English Medium Hr. Sec. School, Bhilai",
    description: "Run your race to win.",
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#002d67",
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
