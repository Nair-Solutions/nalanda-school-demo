import { describe, expect, it } from "vitest";
import en from "@/i18n/dictionaries/en";
import hi from "@/i18n/dictionaries/hi";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") acc[path] = value;
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});
}

const flatEn = flatten(en as unknown as Tree);
const flatHi = flatten(hi as unknown as Tree);

/** Keys whose Hindi value may legitimately equal the English (proper nouns, symbols). */
const sameAllowed = new Set([
  "school.motto",
  "form.emailPlaceholder",
  "documents.fileType",
  "header.switchLanguage",
]);

/** Latin words allowed inside Hindi strings: names, acronyms, product names, the motto. */
const allowedLatin =
  /\b(CBSE|NEMHSS|PDF|Google|Maps|English|NEXT_LOCALE|Run|your|race|to|win|name|example|com|nalandakurud|in|kg)\b/g;

describe("translation dictionaries", () => {
  it("have exactly the same keys", () => {
    expect(Object.keys(flatHi).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("have no empty strings", () => {
    for (const [key, value] of [...Object.entries(flatEn), ...Object.entries(flatHi)]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("translate every Hindi value (no English copied across)", () => {
    const untranslated = Object.keys(flatEn).filter(
      (key) => !sameAllowed.has(key) && flatEn[key] === flatHi[key],
    );
    expect(untranslated).toEqual([]);
  });

  it("contain no stray English words in Hindi strings", () => {
    const offenders = Object.entries(flatHi)
      .filter(([key]) => !sameAllowed.has(key))
      .map(
        ([key, value]) =>
          [
            key,
            value
              .replace(/\{\w+\}/g, "")
              .replace(allowedLatin, "")
              .match(/[A-Za-z]{3,}/g),
          ] as const,
      )
      .filter(([, words]) => words);
    expect(offenders).toEqual([]);
  });

  it("keep the same {placeholders} in both languages", () => {
    for (const key of Object.keys(flatEn)) {
      const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(placeholders(flatHi[key]!), key).toEqual(placeholders(flatEn[key]!));
    }
  });
});
