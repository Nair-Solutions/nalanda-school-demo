# Architecture

## Overview

A statically generated, bilingual Next.js site with one serverless endpoint (the enquiry form). There is no database, no CMS and no login.

```
Browser
  │
  ├─ GET /            → src/proxy.ts ── cookie NEXT_LOCALE? ──yes──▶ 307 /{locale}
  │                                         └─no──▶ language chooser (static)
  ├─ GET /contact, /guidelines/ (legacy, no locale) → proxy → 308 /{locale}/…
  ├─ GET /{en|hi}/{slug}   → pre-rendered HTML (SSG, 30 pages)
  └─ POST /api/enquiry     → validate (Zod) → spam traps → rate limit
                               → Resend email OR JSON webhook (e.g. Google Sheet)
                               → 503 "notConfigured" if neither is set
```

## Directory layout

| Path                                                                           | Purpose                                                                           |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `src/app/(language-gate)/`                                                     | `/`: first-visit language chooser (its own root layout)                           |
| `src/app/[locale]/`                                                            | Root layout per locale (sets `<html lang>`), every page, the locale 404           |
| `src/app/api/enquiry/route.ts`                                                 | Enquiry endpoint                                                                  |
| `src/app/global-not-found.tsx`                                                 | Bilingual 404 for URLs that match no route                                        |
| `src/app/sitemap.ts`, `robots.ts`, `icon.png`, `apple-icon.png`, `favicon.ico` | SEO and icons                                                                     |
| `src/proxy.ts`                                                                 | Language redirect and legacy/locale-less redirects (Next 16's renamed middleware) |
| `src/i18n/`                                                                    | Locale config, typed dictionaries (`en.ts`, `hi.ts`), path and cookie helpers     |
| `src/content/`                                                                 | School facts, routes, documents and achievements: the "CMS"                       |
| `src/components/`                                                              | Layout (header, footer, page header), navigation, form, poster viewer, UI         |
| `src/lib/`                                                                     | Metadata, enquiry schema/delivery, rate limit, site URL, JSON-LD helper           |
| `tests/unit/`, `tests/e2e/`                                                    | Vitest and Playwright suites                                                      |
| `reference/`                                                                   | Untouched supplied files (logo, poster, earlier demo)                             |

## Key flows

**Language.** The URL decides the language (`/en/…`, `/hi/…`), so every page is crawlable and shareable in both languages. The cookie only remembers the choice for `/` and for locale-less links. The toggle is a real `<a>` to the same page in the other language. It works without JavaScript, and when JavaScript is on it also saves the cookie.

**Content.** Pages read only from `src/content/*` and the dictionaries. Missing information renders `PendingNotice` ("being updated") rather than placeholder text, and supplying the data switches the page over automatically (documents, contact details).

**Enquiries.** The client and server share one Zod schema (`src/lib/enquiry-schema.ts`). Error codes, not messages, cross the wire, so validation is translated client-side. Success is shown only on a 200 `{ok:true}` from the server.

## Rendering and caching

- All 30 content pages are SSG (`generateStaticParams`, `dynamicParams = false`), so unknown locales return 404.
- Only `/api/enquiry` runs per request. The proxy runs on every page request (cheap: one cookie read).
- Proxy redirects send `Cache-Control: private, no-store` and `Vary: Cookie`, so CDNs never share a language-specific redirect.

See [`technology-decisions.md`](technology-decisions.md) and [`adr/`](adr/) for the reasoning.
