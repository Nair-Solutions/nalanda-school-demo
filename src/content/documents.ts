import type { PageSlug } from "./routes";

/**
 * Public documents shown on the Rules & Regulations pages. To publish one,
 * put the PDF in public/documents/ and set `file` (see README → Updating content).
 * `file: null` renders as "Being updated" – never link a document that has not been supplied.
 */
export interface SchoolDocument {
  id: string;
  page: PageSlug;
  /** Original document title, shown as-is in both languages. */
  title: string;
  /** Path under /public, e.g. "/documents/academic-calendar-2026-27.pdf". */
  file: string | null;
  /** Where the file came from (original site URL or "supplied by school"). */
  source: string | null;
  /** ISO date the document was issued or last updated, e.g. "2026-04-01". */
  date?: string;
  /** File size in kilobytes, shown next to the download button. */
  sizeKb?: number;
}

export const documents: SchoolDocument[] = [];

export function documentsFor(page: PageSlug): SchoolDocument[] {
  return documents.filter((doc) => doc.page === page);
}
