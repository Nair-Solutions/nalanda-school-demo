import { locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, pageSlugs, type PageSlug } from "@/content/routes";
import { documents } from "@/content/documents";
import type { SearchEntry } from "./search";

const sectionFor = {
  "": null,
  about: "about",
  academics: "academics",
  admission: "admission",
  facilities: "facilities",
  achievements: "achievements",
  gallery: "gallery",
  "rules-and-regulations": "rules",
  guidelines: "guidelines",
  "academic-calendar": "academicCalendar",
  "book-list": "bookList",
  teachers: "teachers",
  "public-disclosure": "publicDisclosure",
  contact: "contact",
  privacy: "privacy",
} as const satisfies Record<PageSlug, keyof Dictionary | null>;

function describe(dict: Dictionary, slug: PageSlug): string {
  const section = sectionFor[slug];
  if (!section) return dict.meta.defaultDescription;
  return (dict[section] as { metaDescription: string }).metaDescription;
}

/** Everything a visitor can search for, in the given language. Built at render time on the server. */
export function buildSearchIndex(locale: Locale): SearchEntry[] {
  const dict = getDictionary(locale);
  const all = locales.map(getDictionary);
  const pages: SearchEntry[] = pageSlugs.map((slug) => {
    const title = dict.nav[pageNavKey[slug]];
    const description = describe(dict, slug);
    const haystack = all
      .flatMap((d) => [d.nav[pageNavKey[slug]], describe(d, slug)])
      .join(" ")
      .toLowerCase();
    const titles = all
      .map((d) => d.nav[pageNavKey[slug]])
      .join(" ")
      .toLowerCase();
    return { title, description, href: pagePath(locale, slug), kind: "page", haystack, titles };
  });
  const docs: SearchEntry[] = documents
    .filter((doc) => doc.file)
    .map((doc) => ({
      title: doc.title,
      description: dict.nav[pageNavKey[doc.page]],
      href: doc.file!,
      kind: "document",
      haystack:
        `${doc.title} ${all.map((d) => d.nav[pageNavKey[doc.page]]).join(" ")}`.toLowerCase(),
      titles: doc.title.toLowerCase(),
    }));
  return [...docs, ...pages];
}
