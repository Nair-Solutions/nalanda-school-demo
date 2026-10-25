import { Download, FileText } from "lucide-react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PageSlug } from "@/content/routes";
import { documentsFor } from "@/content/documents";

/** Downloadable documents for a page. Renders nothing when none are published yet. */
export function DocumentList({ page, dict }: { page: PageSlug; dict: Dictionary }) {
  const docs = documentsFor(page).filter((doc) => doc.file);
  if (docs.length === 0) return null;
  return (
    <section aria-labelledby={`docs-${page}`}>
      <h2 id={`docs-${page}`} className="text-navy-900 text-2xl font-bold">
        {dict.documents.heading}
      </h2>
      <ul className="mt-4 grid gap-3">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="border-line flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
          >
            <span className="flex items-center gap-3">
              <FileText aria-hidden="true" className="text-crimson-800" />
              <span className="text-navy-900 font-semibold" lang="en">
                {doc.title}
              </span>
              <span className="text-muted text-sm">{dict.documents.fileType}</span>
            </span>
            <span className="flex gap-2">
              <a
                href={doc.file!}
                target="_blank"
                rel="noopener"
                className="text-navy-800 hover:bg-navy-50 inline-flex min-h-11 items-center rounded-lg px-3 font-semibold"
              >
                {dict.common.view}
                <span className="sr-only">
                  {" "}
                  {doc.title} {dict.common.opensInNewTab}
                </span>
              </a>
              <a
                href={doc.file!}
                download
                className="bg-navy-800 hover:bg-navy-900 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 font-semibold text-white"
              >
                <Download aria-hidden="true" size={16} />
                {dict.common.download}
                <span className="sr-only"> {doc.title}</span>
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
