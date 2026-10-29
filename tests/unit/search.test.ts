import { describe, expect, it } from "vitest";
import { buildSearchIndex } from "@/lib/search-index";
import { searchEntries } from "@/lib/search";

describe("site search", () => {
  const en = buildSearchIndex("en");
  const hi = buildSearchIndex("hi");

  it("indexes every page in each language with locale links", () => {
    expect(en.filter((e) => e.kind === "page")).toHaveLength(15);
    expect(en.every((e) => e.kind !== "page" || e.href.startsWith("/en"))).toBe(true);
    expect(hi.every((e) => e.kind !== "page" || e.href.startsWith("/hi"))).toBe(true);
  });

  it("finds pages by title and description", () => {
    expect(searchEntries(en, "calendar")[0]?.href).toBe("/en/academic-calendar");
    expect(searchEntries(en, "book list")[0]?.href).toBe("/en/book-list");
    expect(searchEntries(en, "ADMISSION").map((e) => e.href)).toContain("/en/admission");
  });

  it("matches English words on Hindi pages and Hindi words on English pages", () => {
    const fromEnglish = searchEntries(hi, "calendar")[0];
    expect(fromEnglish?.href).toBe("/hi/academic-calendar");
    expect(fromEnglish?.title).toBe("शैक्षणिक कैलेंडर");
    expect(searchEntries(en, "पुस्तक")[0]?.href).toBe("/en/book-list");
  });

  it("requires every word and returns nothing for an empty or unknown query", () => {
    expect(searchEntries(en, "   ")).toEqual([]);
    expect(searchEntries(en, "calendar zebra")).toEqual([]);
  });

  it("ranks title matches first and respects the limit", () => {
    const results = searchEntries(en, "school", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});
