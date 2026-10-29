import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, type PageSlug } from "@/content/routes";
import { getSiteUrl } from "@/lib/site";
import { jsonLdString } from "@/lib/json-ld";

interface Props {
  locale: Locale;
  dict: Dictionary;
  slug: PageSlug;
  title: string;
  lead?: string;
  /** Intermediate breadcrumb (e.g. Rules & Regulations for its sub-pages). */
  parent?: PageSlug;
}

/** Page title band with breadcrumbs (visible and as BreadcrumbList structured data). */
export function PageHeader({ locale, dict, slug, title, lead, parent }: Props) {
  const crumbs: { slug: PageSlug; label: string }[] = [
    { slug: "", label: dict.nav.home },
    ...(parent ? [{ slug: parent, label: dict.nav[pageNavKey[parent]] }] : []),
    { slug, label: title },
  ];
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${pagePath(locale, crumb.slug)}`,
    })),
  };

  return (
    <div className="bg-navy-800 relative overflow-hidden text-white">
      <div className="container-page py-12 sm:py-20">
        <nav aria-label={dict.common.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={crumb.slug || "home"} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight aria-hidden="true" size={14} />}
                  {last ? (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={pagePath(locale, crumb.slug)} className="hover:text-gold-400">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className="text-display mt-5 max-w-5xl">{title}</h1>
        {lead && <p className="measure text-body mt-5 text-white/85 sm:text-xl">{lead}</p>}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </div>
  );
}
