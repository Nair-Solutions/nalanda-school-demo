import type { Metadata } from "next";
import { htmlLang, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "./page";
import { pagePath, type PageSlug } from "@/content/routes";
import { getSiteUrl } from "./site";

interface PageMetaInput {
  locale: Locale;
  slug: PageSlug;
  title: string;
  description?: string;
}

/** Per-page metadata with canonical URL, hreflang alternates and Open Graph. */
export function pageMetadata({ locale, slug, title, description }: PageMetaInput): Metadata {
  const dict = getDictionary(locale);
  const desc = description ?? dict.meta.defaultDescription;
  const path = pagePath(locale, slug);
  const languages = Object.fromEntries(
    locales.map((l) => [htmlLang[l], pagePath(l, slug)]),
  ) as Record<string, string>;
  languages["x-default"] = slug ? pagePath("en", slug) : "/";

  return {
    title: slug ? title : { absolute: title },
    description: desc,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title,
      description: desc,
      url: path,
      locale: htmlLang[locale].replace("-", "_"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: dict.meta.siteName }],
    },
    twitter: { card: "summary_large_image", title, description: desc },
    metadataBase: new URL(getSiteUrl()),
  };
}

type MetaSection = { metaTitle: string; metaDescription: string };
type SectionKey = {
  [K in keyof Dictionary]: Dictionary[K] extends MetaSection ? K : never;
}[keyof Dictionary];

/** generateMetadata factory for a page whose dictionary section has metaTitle/metaDescription. */
export function metadataFor(slug: PageSlug, section: SectionKey) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale, dict } = await resolveLocale(params);
    const t = dict[section] as MetaSection;
    return pageMetadata({ locale, slug, title: t.metaTitle, description: t.metaDescription });
  };
}
