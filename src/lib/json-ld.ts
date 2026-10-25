/** Serialize structured data for a <script type="application/ld+json"> tag safely. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
