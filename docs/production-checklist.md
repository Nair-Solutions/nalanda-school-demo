# Production checklist

Tick each item before the production deploy.

## Blocked on access / third parties

- [ ] Allow `nalandakurud.in`, `www.nalandakurud.in` and `maps.app.goo.gl` in the cloud environment's network settings, then complete the original-site audit
- [ ] Import the repo into Vercel (see `deployment-guide.md`) and add `*.vercel.app` to allowed domains so previews can be tested from the build environment

## Content (from the school)

- [ ] Postal address, phone, email → `src/content/school.ts`
- [ ] Inbox that should receive enquiries
- [ ] Guidelines, academic calendar, book list, teachers list, mandatory public disclosure (PDFs) → `public/documents/` + `src/content/documents.ts`
- [ ] Legacy URLs for those pages → `legacyRedirects` in `src/content/routes.ts`
- [ ] Classes/sections, streams, admission process, facilities
- [ ] Campus photographs, with written permission (especially any photos showing students)
- [ ] History / vision / principal's message
- [ ] Confirm Aaditya Sahu's medal colour (poster shows only an icon)
- [ ] Confirm consent to publish student names from the achievers poster on the website (the poster is the school's own public material)
- [ ] Parent portal URL, if one exists
- [ ] Hindi copy reviewed and signed off by a native speaker at the school
- [ ] Higher-resolution or original logo and poster files, if available

## Configuration

- [ ] Enquiry delivery env vars set (Resend or webhook) and a **real test enquiry received**
- [ ] `NEXT_PUBLIC_SITE_URL` set once the domain is connected
- [ ] Vercel plan matches the usage terms (see `technology-decisions.md`)

## Verification on the preview URL

- [ ] `E2E_BASE_URL=<preview> npx playwright test` passes
- [ ] `node scripts/check-links.mjs <preview>` passes; external links checked by hand
- [ ] Lighthouse mobile on `/en` and `/hi`
- [ ] Manual check on a real Android phone (Chrome) and an iPhone (Safari), in both languages
- [ ] Response headers present (CSP, HSTS); HTTPS only
- [ ] The form shows an honest error when delivery fails (temporarily break the key on a preview)

## Go-live

- [ ] School approval for production
- [ ] DNS change by the domain owner (keep MX/TXT records)
- [ ] Sitemap submitted to Google Search Console
- [ ] Old site's content fully migrated before it is switched off
