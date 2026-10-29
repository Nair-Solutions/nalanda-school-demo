import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu, type PageSlug } from "@/content/routes";
import { documentsFor } from "@/content/documents";

const descriptionKey = {
  guidelines: "guidelinesDesc",
  "academic-calendar": "academicCalendarDesc",
  "book-list": "bookListDesc",
  teachers: "teachersDesc",
  "public-disclosure": "publicDisclosureDesc",
} as const satisfies Record<(typeof rulesMenu)[number], keyof Dictionary["rules"]>;

interface Props {
  locale: Locale;
  dict: Dictionary;
  headingLevel?: 2 | 3;
  /** Leave out the page the reader is already on. */
  exclude?: PageSlug;
}

/** The Rules & Regulations pages as a plain, large-type list with honest availability. */
export function ResourceList({ locale, dict, headingLevel = 3, exclude }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-2 md:grid-cols-2" data-testid="resource-list">
      {rulesMenu
        .filter((slug) => slug !== exclude)
        .map((slug) => {
          const available = documentsFor(slug).some((doc) => doc.file);
          return (
            <li key={slug}>
              <Link
                href={pagePath(locale, slug)}
                className="group hover:bg-navy-50 flex h-full items-start justify-between gap-6 rounded-2xl bg-white p-6 transition-colors"
              >
                <span>
                  <Heading className="text-title text-navy-900 font-sans group-hover:underline">
                    {dict.nav[pageNavKey[slug]]}
                  </Heading>
                  <span className="text-ink mt-1 block text-base">
                    {dict.rules[descriptionKey[slug]]}
                  </span>
                  <span
                    className={`mt-3 inline-block text-sm font-semibold ${available ? "text-emerald-800" : "text-[#6b4a0c]"}`}
                  >
                    {available ? dict.common.available : dict.common.beingUpdated}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={22}
                  className="text-crimson-800 mt-1 shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
