import en, { type Dictionary } from "./dictionaries/en";
import hi from "./dictionaries/hi";
import type { Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, hi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Replace `{name}` placeholders in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
