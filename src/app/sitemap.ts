import type { MetadataRoute } from "next";
import { htmlLang, locales } from "@/i18n/config";
import { pagePath, pageSlugs } from "@/content/routes";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return pageSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${base}${pagePath(locale, slug)}`,
      changeFrequency: "monthly" as const,
      priority: slug === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [htmlLang[l], `${base}${pagePath(l, slug)}`]),
        ),
      },
    })),
  );
}
