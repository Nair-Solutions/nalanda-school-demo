import { Mukta, Noto_Serif, Noto_Serif_Devanagari } from "next/font/google";

/** Body text: Mukta covers both Latin and Devanagari with matching metrics. */
export const bodyFont = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Headings: Noto Serif for Latin, with Noto Serif Devanagari as the Hindi companion. */
export const displayFont = Noto_Serif({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display-latin",
  display: "swap",
});

export const displayFontDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["600", "700"],
  variable: "--font-display-deva",
  display: "swap",
});

export const fontVariables = `${bodyFont.variable} ${displayFont.variable} ${displayFontDevanagari.variable}`;
