# QA report

Run on 2026-10-25 in the cloud build environment (Node 22.22, Chromium 1243 via Playwright 1.63) against `npm run build && next start`.

## Commands and results

| Check            | Command                                                                      | Result                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install          | `npm ci`                                                                     | ✅ 0 vulnerabilities reported by npm                                                                                                                            |
| Lint             | `npm run lint`                                                               | ✅ 0 problems                                                                                                                                                   |
| Formatting       | `npm run format:check`                                                       | ✅                                                                                                                                                              |
| Types            | `npm run typecheck` (`next typegen && tsc --noEmit`, strict)                 | ✅                                                                                                                                                              |
| Unit tests       | `npm test` (Vitest)                                                          | ✅ **37 passed**                                                                                                                                                |
| Production build | `npm run build`                                                              | ✅ 30 SSG pages + language page + API route                                                                                                                     |
| E2E              | `npm run test:e2e` (desktop 1366×900, tablet 820×1180 touch, mobile Pixel 7) | ✅ **167 passed, 67 skipped by design** (axe runs on desktop only; desktop-only and mobile-only nav tests skip on the other viewports)                          |
| Accessibility    | axe-core, WCAG 2.0/2.1/2.2 A+AA, all 31 pages                                | ✅ 0 violations                                                                                                                                                 |
| Internal links   | `npm run check:links`                                                        | ✅ 46 internal URLs, all 200                                                                                                                                    |
| External links   | same                                                                         | ⚠️ 3 external links **unverified**: `maps.app.goo.gl` ×2 and `nalandakurud.in/guidelines/` are blocked by this environment's network policy. Not proven broken. |
| CSP              | e2e listens for `securitypolicyviolation` on every page                      | ✅ 0 violations                                                                                                                                                 |

### What the route tests assert on every page × locale × viewport

HTTP 200 · correct `<html lang>` · non-empty, unique `<title>` · exactly one `<h1>` · canonical URL · **no horizontal overflow** · every displayed image loaded · no `href="#"`/empty links · no console or page errors · no CSP violations · **on Hindi pages: no English words outside an allow-list** (proper names, acronyms, the motto).

### Translation checks

- Compile time: `hi.ts` is typed against `en.ts`, so a missing key fails the build.
- Unit: identical keys; no empty values; no value copied unchanged from English (allow-list: motto, email placeholder, "PDF", the "हिन्दी" toggle label); no stray Latin words; placeholders match.
- E2E: rendered text of all 15 Hindi pages scanned; EN → HI → EN switching tested with back/forward, on desktop and in the mobile menu.
- **Not done:** review by a native Hindi speaker at the school. The copy was written carefully but needs sign-off.

## Performance (Lighthouse 12, mobile emulation with simulated slow 4G, local server)

| Page               | Perf | A11y | Best practices | SEO | LCP   | CLS   | TBT   |
| ------------------ | ---- | ---- | -------------- | --- | ----- | ----- | ----- |
| `/en`              | 94   | 100  | 100            | 100 | 2.8 s | 0.037 | 60 ms |
| `/hi`              | 88   | 100  | 100            | 100 | 3.5 s | 0.018 | 60 ms |
| `/en/contact`      | 93   | 100  | 96*            | 100 | 3.0 s | 0.002 | 50 ms |
| `/hi/achievements` | 99   | 100  | 100            | 100 | 2.2 s | 0.007 | 50 ms |

\*Measured before the Zod `jitless` fix. The only flagged item was the CSP issue that fix removed (the e2e CSP check now passes on the contact page). Not re-measured.

Fixes made during QA: font payload on English pages dropped from **482 KB to 125 KB** (no font preloading; `unicode-range` subsets), which raised `/en` from 77 to 94. Hindi pages load ~308 KB of Devanagari fonts; that is the main remaining cost (see "Known issues").

These are local measurements without a CDN. Re-measure on the Vercel preview.

## Visual QA

Screenshots were reviewed for the language page, the EN and HI homepages (1440 and 390 wide), the open dropdown (HI), the mobile menu (HI), Achievements (HI) and Contact with validation errors (EN). Issues found and fixed: the mobile header showed the desktop CTA; the hero emblem's square background stuck out of its circle; letter-spacing broke Devanagari conjuncts; the mobile wordmark wrapped onto two lines.

Comparison with the earlier demo (`reference/legacy-demo`): the new build keeps its navy/gold direction, language gate, compact toggle, Rules & Regulations dropdown and poster feature. It drops the demo's Unsplash stock photos and placeholder copy, because no real campus photos were available.

## Known issues and limits

1. **Original site audit not done:** network access blocked (see `original-website-audit.md`).
2. **No real campus photos.** Gallery and Facilities show "being updated" plus links to Google Maps.
3. **Enquiry delivery not configured.** The form honestly reports "not switched on" until Resend or webhook env vars are set.
4. Rate limiting is per serverless instance (best effort).
5. Hindi pages carry ~308 KB of fonts. Options: drop Noto Serif Devanagari headings in favour of Mukta bold (−~125 KB), or self-host subsetted fonts.
6. Not tested: real Safari/iOS and Firefox (Chromium only), real screen readers (axe only), real email delivery.

---

## Redesign release (2026-10-29)

Design system rebuilt from impeccable, taste-skill, ui-ux-pro-max and awesome-design-md (see `DESIGN.md`, `PRODUCT.md`, `design-system/nalanda/MASTER.md`).

| Check                                       | Result                                                                                                                                                                                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, Prettier, `tsc` (strict)              | ✅                                                                                                                                                                                                                                                                                                    |
| Unit tests (Vitest)                         | ✅ **42 passed** (adds search index/matching)                                                                                                                                                                                                                                                         |
| Production build                            | ✅ 39 static routes + API                                                                                                                                                                                                                                                                             |
| E2E (Playwright, desktop / tablet / mobile) | ✅ **200 passed**, 67 skipped by design. New: call-back card (validation, honest not-configured, success only on 200), search (button, mobile bar, Ctrl/⌘+K, Hindi + English words, empty state, Escape), mobile action bar, rules pager, gallery viewer, stacked results on phones, scroll entrances |
| axe WCAG 2.2 AA on all 31 pages             | ✅ 0 violations                                                                                                                                                                                                                                                                                       |
| Link check                                  | ✅ 50 internal URLs                                                                                                                                                                                                                                                                                   |
| Lighthouse (mobile, local)                  | `/en` 89 / 100 / 100 / 100 (LCP 3.4 s, CLS 0.05) · `/hi` 92 / 100 / 100 / 100 (LCP 2.8 s)                                                                                                                                                                                                             |

Bugs found and fixed during this round: search ranking ignored English titles on Hindi pages; Escape in the search field only cleared the text; the six-line hero headline (now "Nalanda" + the rest of the name); emblem fallback too tall on phones; footer padding under the mobile bar.

**Not run here:** `npx impeccable detect` and the taste-skill `inspect.mjs` (running third-party scripts was not permitted in this environment; the detector runs in CI as an advisory step once GitHub Actions billing is fixed). Real iOS/Safari and screen readers remain untested.
