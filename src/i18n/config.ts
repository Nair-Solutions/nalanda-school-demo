export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that stores the visitor's chosen language. Functional only; no tracking. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "hi";
}

/** BCP 47 tags used for the html lang attribute and hreflang links. */
export const htmlLang: Record<Locale, string> = {
  en: "en-IN",
  hi: "hi-IN",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};
