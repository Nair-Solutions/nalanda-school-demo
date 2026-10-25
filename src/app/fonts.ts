import { Mukta, Noto_Serif, Noto_Serif_Devanagari } from "next/font/google";

/*
 * Fonts are not preloaded: next/font emits unicode-range @font-face rules, so
 * the browser fetches only the scripts a page actually renders (Latin on
 * English pages, Devanagari on Hindi pages). Preloading would force every
 * subset and weight onto every page (~480 KB measured). Text renders
 * immediately in the fallback font thanks to display: swap.
 */

/** Body text: Mukta covers both Latin and Devanagari with matching metrics. */
export const bodyFont = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

/** Headings: Noto Serif for Latin, with Noto Serif Devanagari as the Hindi companion. */
export const displayFont = Noto_Serif({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display-latin",
  display: "swap",
  preload: false,
});

export const displayFontDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["700"],
  variable: "--font-display-deva",
  display: "swap",
  preload: false,
});

export const fontVariables = `${bodyFont.variable} ${displayFont.variable} ${displayFontDevanagari.variable}`;
