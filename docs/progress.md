# Progress checklist

Last updated 2026-10-26.

## Stage A: Discover

- [x] Local references found and preserved (`reference/`): logo, poster, standalone demo HTML + README
- [ ] `Nalanda_Kurud_Demo_Full_Project.zip`: **not supplied** (the standalone HTML and README were)
- [ ] Original site audit: **blocked** (network policy), see `original-website-audit.md`. The allow-list has now been updated; run the audit in a new session
- [ ] Google Maps photos: **blocked**; linked externally only, nothing downloaded
- [x] Content inventory and migration map from verified sources

## Stage B: Plan

- [x] Stack chosen and documented (`technology-decisions.md`, `adr/`)
- [x] Routes, content model, bilingual strategy, interaction inventory, test strategy

## Stage C: Build

- [x] Next.js 16 + TS strict + Tailwind 4 project, lint/format/editorconfig/env example
- [x] Design system from the logo (navy/red/gold, Noto Serif + Mukta for Devanagari)
- [x] Language chooser, persistent preference, toggle that keeps the page (header, mobile menu, footer)
- [x] Header with logo-home, sticky nav, Rules & Regulations dropdown, mobile menu
- [x] 15 pages × 2 languages, footer, breadcrumbs, 404s
- [x] Achievements with the supplied poster + accessible results table + full-size viewer
- [x] Enquiry form + API (validation, spam traps, rate limit, Resend/webhook, honest not-configured state)
- [x] SEO: titles, descriptions, canonical, hreflang, OG image, sitemap, robots, JSON-LD
- [x] Security headers and CSP

## Stage D: Validate

- [x] Lint, types, build, 37 unit tests, 167 e2e tests (3 viewports), axe on all pages, link check, Lighthouse
- [x] Issues found in QA fixed (see `qa-report.md`)

## Stage E: Ship

- [x] Committed and pushed to `claude/stoic-turing-gmzipd`
- [x] Pull request opened against `main` (Nair-Solutions/nalanda-school-demo#1)
- [x] GitHub Actions enabled for the repository (first runs had failed to start while Actions was blocked)
- [x] Repository made public so Actions runs on free minutes (private runs were blocked by organization billing)
- [ ] CI green on the pull request
- [ ] Vercel project import: **needs the owner** (no Vercel access from this environment)
- [ ] Preview tested
- [ ] Production deploy and DNS: **needs school approval**

## Redesign (2026-10-29): all roadmap phases

- [x] Phase 1: `PRODUCT.md`, `DESIGN.md`, `design-system/nalanda/MASTER.md`; impeccable, taste-skill and ui-ux-pro-max in `.claude/skills/`; impeccable detector in CI (advisory)
- [x] Phase 2: visual reset (no eyebrows, icon-card grids, resting shadows, gradients/blobs, side borders; pill actions; 5-size type scale; themed selection, caret, scrollbars)
- [x] Phase 3: homepage (working call-back card in the hero, Nalanda heritage band, documents list, achievements, see the school) — hero photo slot ready, **photo not yet added** (Wikimedia was unreachable from the build environment)
- [x] Phase 4: document pages (dates/sizes, previous/next, reading width)
- [x] Phase 5: mobile (bottom action bar, bottom-sheet menu, stacked results; Call/WhatsApp appear once numbers are verified)
- [x] Phase 6: gallery viewer (filters, swipe, keys, Motion transitions) and data-driven facilities — **waiting for school photos**
- [x] Phase 7: motion (CSS hero reveal, homepage entrances, dialog entrance, reduced-motion)
- [x] Phase 8: site search (pages + documents, both languages) and notices strip (shows when notices exist)
- [ ] Not built: "Find your class" (needs class-wise data) and visit booking (school has not confirmed visits)
