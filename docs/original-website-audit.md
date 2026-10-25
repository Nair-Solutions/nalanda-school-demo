# Original website audit — nalandakurud.in

**Status: BLOCKED (partially complete).** Last updated 2026-10-25.

## What could not be done, and why

The build environment's network policy denied every request to the original site and to the Google Maps short links. The proxy returned `CONNECT tunnel failed, response 403` for:

| Host                  | Purpose                                                | Result                                   |
| --------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `www.nalandakurud.in` | Original site, its pages, PDFs, `wp-json` API, sitemap | Blocked (403 from the environment proxy) |
| `maps.app.goo.gl`     | Google Maps photo collections 1 and 2                  | Blocked (403 from the environment proxy) |

Because of this, **none of the following has been inspected yet**:

- The original pages, navigation, dropdowns and footer
- Downloadable documents (calendar, book list, teachers list, public disclosure PDFs)
- CMS/technology fingerprinting, metadata, SEO, broken links, security headers, mixed content, page speed
- Google Maps photos (none were downloaded, and none are presented as if they were)

Nothing in this repository claims otherwise. No original-site content has been copied or invented.

**To unblock:** add `nalandakurud.in`, `www.nalandakurud.in` and `maps.app.goo.gl` to the cloud environment's _Allowed domains_ (environment settings → Network access), then re-run Stage A. See [`production-checklist.md`](production-checklist.md).

## What was verified from other sources

| Source                                         | What it established                                                                                                                                                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Official logo (supplied by the project owner)  | Name "Nalanda English Medium Hr. Sec. School – Bhilai", initials "NEMHSS", motto "Run your race to win", brand colours navy `#002d67` and red `#82040e`                                                                                                        |
| Judo Achievers 2026 poster (supplied)          | Five medal results at the CBSE Far East Zone Judo Championship 2026, venue Maharishi Vidya Mandir, Tatibandh, Raipur; students in Classes 8, 9 and 12 (so the school teaches at least up to Class 12); the school's own short form "ENG. MED. HR. SEC. SCHOOL" |
| Project brief                                  | Original homepage URL, the Guidelines URL `https://www.nalandakurud.in/guidelines/`, the Rules & Regulations menu (Guidelines, Academic Calendar, Book List, Teachers List, Public Disclosure)                                                                 |
| Earlier design demo (`reference/legacy-demo/`) | Design direction only. Its README states it is "not … a verified source of school information"; its menu also lists _Activities_ and _PTA_, which are recorded as **unverified** below                                                                         |

## Discovered routes (from the brief only)

| Original URL                                                   | Status                  | Notes                                                                                |
| -------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `https://www.nalandakurud.in/`                                 | Not inspected (blocked) | Homepage                                                                             |
| `https://www.nalandakurud.in/guidelines/`                      | Not inspected (blocked) | Supplied in the brief; linked from the new Guidelines page until content is migrated |
| Academic Calendar, Book List, Teachers List, Public Disclosure | URLs unknown            | Named in the brief's description of the Rules & Regulations menu                     |
| Activities, PTA                                                | Unverified              | Appear only in the earlier demo                                                      |
| Parent portal                                                  | Unknown                 | No portal URL verified, so none is linked                                            |

## Observations that can be made without access

- The domain name suggests the Kurud locality of Bhilai. The site uses "Bhilai, Chhattisgarh" (from the logo) until the school confirms the full address.
- The brief describes the original as WordPress-like (`/guidelines/` trailing-slash URLs). The new site redirects `/guidelines` and `/guidelines/` to the new Guidelines page. Other legacy redirects need the real URL list.

## Recommended improvements (already implemented in the rebuild)

- Bilingual English/Hindi site with real translations, a first-visit language choice and a persistent toggle
- Clear Rules & Regulations hub with one page per resource and honest "being updated" states
- Real enquiry form with server-side validation, spam protection and no fake success
- Per-page titles, descriptions, canonical/hreflang tags, sitemap, robots and structured data
- Security headers (CSP, HSTS, frame-ancestors and others), no third-party trackers
- WCAG 2.2 AA checks via axe on every page

## Next steps once access is granted

1. Crawl the homepage, nav, footer, `sitemap.xml` / `wp-sitemap.xml` and `/wp-json/wp/v2/pages`.
2. Fill in the route matrix in [`content-migration-map.md`](content-migration-map.md) with the real URLs.
3. Download the public PDFs into `public/documents/`, record them in `src/content/documents.ts`, and add redirects in `src/content/routes.ts → legacyRedirects`.
4. Record headers, metadata and broken links here.
