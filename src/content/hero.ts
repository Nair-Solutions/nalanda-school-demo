import type { Picture } from "./types";

/**
 * Homepage hero picture (design option A: the ruins of ancient Nalanda
 * Mahavihara, the name the school carries).
 *
 * To publish it: download a photograph with a licence that allows commercial
 * use (e.g. from Wikimedia Commons, CC BY-SA), save it as
 * public/images/hero/nalanda-mahavihara.jpg and fill in the fields below,
 * including the credit. Until then the hero shows the school emblem.
 *
 * Example:
 * export const heroImage: Picture | null = {
 *   src: "/images/hero/nalanda-mahavihara.jpg", width: 2400, height: 1600,
 *   alt: { en: "Brick ruins of the ancient Nalanda Mahavihara in Bihar", hi: "बिहार में प्राचीन नालंदा महाविहार के ईंटों से बने अवशेष" },
 *   caption: { en: "Ruins of ancient Nalanda Mahavihara, Bihar", hi: "प्राचीन नालंदा महाविहार के अवशेष, बिहार" },
 *   credit: { text: "Photographer name", licence: "CC BY-SA 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:…" },
 * };
 */
export const heroImage: Picture | null = null;
