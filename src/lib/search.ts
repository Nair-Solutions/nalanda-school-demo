/** Client-safe search types and matching (the index itself is built on the server). */

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  kind: "page" | "document";
  /** Lower-cased text matched against the query: both languages, so "calendar" also works on Hindi pages. */
  haystack: string;
  /** Lower-cased titles in every language, used to rank title matches first. */
  titles: string;
}

/** Every word of the query must appear. Titles that match rank first. */
export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return entries
    .filter((entry) => words.every((word) => entry.haystack.includes(word)))
    .sort((a, b) => {
      const at = words.every((w) => a.titles.includes(w)) ? 0 : 1;
      const bt = words.every((w) => b.titles.includes(w)) ? 0 : 1;
      return at - bt;
    })
    .slice(0, limit);
}

export const OPEN_SEARCH_EVENT = "nalanda:open-search";
