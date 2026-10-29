import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu, type PageSlug } from "@/content/routes";

/** Previous / next links through the Rules & Regulations pages (Read mode wayfinding). */
export function RulesPager({
  locale,
  dict,
  slug,
}: {
  locale: Locale;
  dict: Dictionary;
  slug: PageSlug;
}) {
  const index = rulesMenu.indexOf(slug as (typeof rulesMenu)[number]);
  if (index < 0) return null;
  const prev = rulesMenu[index - 1];
  const next = rulesMenu[index + 1];
  return (
    <nav
      aria-label={dict.pager.label}
      className="grid gap-2 sm:grid-cols-2"
      data-testid="rules-pager"
    >
      {prev ? (
        <Link
          href={pagePath(locale, prev)}
          rel="prev"
          className="group hover:bg-navy-50 rounded-2xl bg-white p-5"
        >
          <span className="text-muted flex items-center gap-1.5 text-sm">
            <ArrowLeft aria-hidden="true" size={16} />
            {dict.pager.previous}
          </span>
          <span className="text-title text-navy-900 mt-1 block group-hover:underline">
            {dict.nav[pageNavKey[prev]]}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next && (
        <Link
          href={pagePath(locale, next)}
          rel="next"
          className="group hover:bg-navy-50 rounded-2xl bg-white p-5 text-right"
        >
          <span className="text-muted flex items-center justify-end gap-1.5 text-sm">
            {dict.pager.next}
            <ArrowRight aria-hidden="true" size={16} />
          </span>
          <span className="text-title text-navy-900 mt-1 block group-hover:underline">
            {dict.nav[pageNavKey[next]]}
          </span>
        </Link>
      )}
    </nav>
  );
}
