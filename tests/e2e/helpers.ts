import { pageSlugs } from "../../src/content/routes";

export const locales = ["en", "hi"] as const;

export const allPaths = locales.flatMap((locale) =>
  pageSlugs.map((slug) => (slug ? `/${locale}/${slug}` : `/${locale}`)),
);

/** Latin words that may legitimately appear on Hindi pages (names, acronyms, motto, the English toggle). */
export const allowedLatinOnHindi = new Set(
  [
    "CBSE",
    "NEMHSS",
    "PDF",
    "Google",
    "Maps",
    "English",
    "NEXT_LOCALE",
    "kg",
    "Run",
    "your",
    "race",
    "to",
    "win",
    "nalandakurud",
    "in",
    "name",
    "example",
    "com",
    "NALANDA",
    "ENGLISH",
    "MEDIUM",
    "ENG",
    "MED",
    "HR",
    "SEC",
    "SCHOOL",
    // Student names as printed on the achievers poster
    "Rashi",
    "Sahu",
    "Mitanjali",
    "Singh",
    "Ansh",
    "Choudhary",
    "Aditya",
    "Kumar",
    "Aaditya",
  ].map((w) => w.toLowerCase()),
);
