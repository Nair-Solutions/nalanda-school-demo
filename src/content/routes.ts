/**
 * Every page of the site, in one place. Navigation, footer, sitemap, the
 * proxy's locale-less redirects and the e2e route tests all read this list,
 * so adding a page here is what makes it reachable everywhere.
 */
export const pageSlugs = [
  "",
  "about",
  "academics",
  "admission",
  "facilities",
  "achievements",
  "gallery",
  "rules-and-regulations",
  "guidelines",
  "academic-calendar",
  "book-list",
  "teachers",
  "public-disclosure",
  "contact",
  "privacy",
] as const;

export type PageSlug = (typeof pageSlugs)[number];

/** Key into dictionary.nav for the page's short label. */
export const pageNavKey = {
  "": "home",
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
} as const satisfies Record<PageSlug, string>;

/** Pages grouped under the "Rules & Regulations" menu, mirroring the original site. */
export const rulesMenu = [
  "guidelines",
  "academic-calendar",
  "book-list",
  "teachers",
  "public-disclosure",
] as const satisfies readonly PageSlug[];

/** Desktop primary navigation order. */
export const primaryNav = [
  "about",
  "academics",
  "admission",
  "achievements",
  "gallery",
  "contact",
] as const satisfies readonly PageSlug[];

/**
 * Known URLs from the original WordPress site and where they now live.
 * Only URLs that have actually been verified belong here (see
 * docs/content-migration-map.md). The original site could not be crawled
 * from the build environment yet, so only the Guidelines URL supplied by the
 * project owner is listed.
 */
export const legacyRedirects: Record<string, PageSlug> = {
  "/guidelines": "guidelines",
};

export function pagePath(locale: string, slug: PageSlug): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}
