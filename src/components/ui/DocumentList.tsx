import { Download, FileText } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { htmlLang } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/get-dictionary";
import type { PageSlug } from "@/content/routes";
import { documentsFor } from "@/content/documents";

function formatSize(kb: number, locale: Locale): string {
  const nf = new Intl.NumberFormat(htmlLang[locale], { maximumFractionDigits: 1 });
  return kb >= 1024 ? `${nf.format(kb / 1024)} MB` : `${nf.format(kb)} KB`;
}

/** Downloadable documents for a page. Renders nothing when none are published yet. */
export function DocumentList({
  page,
  dict,
  locale,
}: {
  page: PageSlug;
  dict: Dictionary;
  locale: Locale;
}) {
  const docs = documentsFor(page).filter((doc) => doc.file);
  if (docs.length === 0) return null;
  const dateFormat = new Intl.DateTimeFormat(htmlLang[locale], { dateStyle: "medium" });
  return (
    <section aria-labelledby={`docs-${page}`}>
      <h2 id={`docs-${page}`} className="text-heading text-navy-900">
        {dict.documents.heading}
      </h2>
      <ul className="mt-6 grid gap-2">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5"
          >
            <span className="flex items-start gap-3">
              <FileText aria-hidden="true" className="text-crimson-800 mt-1 shrink-0" />
              <span>
                <span className="text-title text-navy-900 block" lang="en">
                  {doc.title}
                </span>
                <span className="text-muted mt-0.5 block text-sm">
                  {[
                    dict.documents.fileType,
                    doc.sizeKb ? formatSize(doc.sizeKb, locale) : null,
                    doc.date
                      ? format(dict.documents.updated, {
                          date: dateFormat.format(new Date(doc.date)),
                        })
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
            </span>
            <span className="flex gap-2">
              <a
                href={doc.file!}
                target="_blank"
                rel="noopener"
                className="text-navy-800 ring-navy-800 hover:bg-navy-50 inline-flex min-h-11 items-center rounded-full px-4 font-semibold ring-2 ring-inset"
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
                className="bg-crimson-800 hover:bg-crimson-700 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-semibold text-white"
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
