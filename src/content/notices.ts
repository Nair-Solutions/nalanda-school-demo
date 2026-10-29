import type { Bilingual } from "./types";

export interface Notice {
  id: string;
  /** ISO date, e.g. "2026-11-02". */
  date: string;
  title: Bilingual;
  /** Optional link: a page path ("/en/academic-calendar") or a document in /documents/. */
  href?: string;
}

/** Latest notices, newest first. The homepage strip is hidden while this is empty. */
export const notices: Notice[] = [];
