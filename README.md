# Nalanda English Medium Hr. Sec. School, Bhilai: website

Bilingual (English / हिन्दी) website for Nalanda English Medium Higher Secondary School, Bhilai, Chhattisgarh. Built with Next.js 16, TypeScript and Tailwind CSS 4, for deployment on Vercel.

- First-visit language choice, a persistent language toggle on every page, and full Hindi translations
- 15 pages in each language: Home, About, Academics, Admission, Facilities, Achievements, Gallery, Rules & Regulations (Guidelines, Academic Calendar, Book List, Teachers List, Mandatory Public Disclosure), Contact, Privacy
- Real enquiry form (email via Resend, or a Google Sheet webhook) that never shows a fake success
- Statically generated, accessible (axe WCAG 2.2 AA clean), with security headers and no trackers

Only information verified from the school's own material is published. Anything still missing shows as **"being updated"**. See [`docs/content-inventory.md`](docs/content-inventory.md).

## Quick start

Requires Node.js 20.9+ (22 recommended).

```bash
npm install
cp .env.example .env.local   # optional: only needed to test real enquiry delivery
npm run dev                  # http://localhost:3000
```

## Commands

| Command                           | What it does                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                                                                                |
| `npm run build` / `npm start`     | Production build / serve it                                                                                                                       |
| `npm run lint`                    | ESLint (Next.js core-web-vitals + TypeScript rules)                                                                                               |
| `npm run format` / `format:check` | Prettier                                                                                                                                          |
| `npm run typecheck`               | Generate route types, then `tsc --noEmit` (strict)                                                                                                |
| `npm test`                        | Vitest unit tests (translations, validation, API)                                                                                                 |
| `npm run test:e2e`                | Playwright on desktop/tablet/mobile, including axe. **Run `npm run build` first.** First time on a new machine: `npx playwright install chromium` |
| `npm run check:links`             | Crawl a running site (`node scripts/check-links.mjs http://localhost:3100`)                                                                       |
| `npm run check`                   | Lint + types + unit + build                                                                                                                       |

## Project layout

```
src/
  app/(language-gate)/   "/" language chooser
  app/[locale]/          all pages (en, hi), locale layout, 404
  app/api/enquiry/       enquiry endpoint
  proxy.ts               language + legacy redirects
  i18n/dictionaries/     en.ts, hi.ts  ← all interface text
  content/               school facts, routes, documents, achievements  ← site "CMS"
  components/            header, footer, nav, form, poster viewer, UI
  lib/                   metadata, enquiry schema/delivery, rate limit
public/branding, public/images, public/documents
reference/               supplied logo, poster and earlier demo (do not edit)
docs/                    audit, architecture, ADRs, QA, deployment
tests/unit, tests/e2e
```

## Updating content

| Task                                 | Where                                                                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change any text                      | `src/i18n/dictionaries/en.ts` **and** `hi.ts` (the build fails if a key is missing)                                                                       |
| Add phone/email/address              | `src/content/school.ts` (the Contact page shows them automatically)                                                                                       |
| Publish a PDF (calendar, book list…) | Put it in `public/documents/`, add it to `src/content/documents.ts`                                                                                       |
| Redirect an old URL                  | `legacyRedirects` in `src/content/routes.ts`                                                                                                              |
| Add a page                           | Add the slug to `pageSlugs` in `src/content/routes.ts`, create `src/app/[locale]/<slug>/page.tsx`, add dictionary keys. Nav, sitemap and tests pick it up |

Push to a branch → Vercel builds a preview → merge to `main` to publish.

## Enquiry form setup

Set **one** option in Vercel's environment variables (see [`.env.example`](.env.example) and [`docs/deployment-guide.md`](docs/deployment-guide.md)):

- **Email:** `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`
- **Google Sheet:** `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET` with [`docs/integrations/google-sheets-webhook.gs`](docs/integrations/google-sheets-webhook.gs)

With neither set, the form tells visitors online enquiries are not switched on yet.

## Documentation

- [Original website audit](docs/original-website-audit.md) (blocked: no network access to the old site yet)
- [Content inventory](docs/content-inventory.md) · [Migration map](docs/content-migration-map.md)
- [Architecture](docs/architecture.md) · [Technology decisions](docs/technology-decisions.md) · [ADRs](docs/adr/)
- [Interaction inventory](docs/interaction-inventory.md) · [QA report](docs/qa-report.md)
- [Deployment guide](docs/deployment-guide.md) · [Production checklist](docs/production-checklist.md) · [Progress](docs/progress.md)
