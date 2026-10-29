import type { Locale } from "@/i18n/config";

/** A piece of copy that must exist in both languages. */
export type Bilingual = Record<Locale, string>;

/** A picture with its real dimensions, bilingual alt text and (for found pictures) a credit. */
export interface Picture {
  src: string;
  width: number;
  height: number;
  alt: Bilingual;
  caption?: Bilingual;
  /** Required for any picture that is not the school's own (archive, Wikimedia Commons…). */
  credit?: { text: string; licence: string; sourceUrl: string };
}
