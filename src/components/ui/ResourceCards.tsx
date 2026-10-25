import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu } from "@/content/routes";
import { documentsFor } from "@/content/documents";
import { pageIcons } from "./page-icons";
import { StatusBadge } from "./StatusBadge";

const descriptionKey = {
  guidelines: "guidelinesDesc",
  "academic-calendar": "academicCalendarDesc",
  "book-list": "bookListDesc",
  teachers: "teachersDesc",
  "public-disclosure": "publicDisclosureDesc",
} as const satisfies Record<(typeof rulesMenu)[number], keyof Dictionary["rules"]>;

/** Cards for the Rules & Regulations pages, with an honest availability badge. */
export function ResourceCards({
  locale,
  dict,
  headingLevel = 3,
}: {
  locale: Locale;
  dict: Dictionary;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rulesMenu.map((slug) => {
        const Icon = pageIcons[slug];
        const available = documentsFor(slug).length > 0;
        return (
          <li key={slug}>
            <Link
              href={pagePath(locale, slug)}
              className="group border-line shadow-card hover:border-navy-800/40 flex h-full flex-col rounded-xl border bg-white p-5 transition-colors"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="bg-navy-50 text-navy-800 flex h-11 w-11 items-center justify-center rounded-lg">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <StatusBadge
                  tone={available ? "ok" : "pending"}
                  label={available ? dict.common.available : dict.common.beingUpdated}
                />
              </span>
              <Heading className="text-navy-900 mt-4 text-lg font-bold">
                {dict.nav[pageNavKey[slug]]}
              </Heading>
              <span className="text-muted mt-1 flex-1 text-[15px]">
                {dict.rules[descriptionKey[slug]]}
              </span>
              <span className="text-crimson-800 mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                {dict.common.view}
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
