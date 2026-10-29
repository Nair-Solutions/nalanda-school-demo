# ADR 0001: Next.js App Router with static generation

- Status: Accepted (2026-10-25)

## Context

The site is content-heavy, bilingual, SEO-sensitive and rarely changes. It needs one server-side capability (the enquiry form). The maintainer usually works in Vite + React on Vercel.

## Decision

Use Next.js 16 App Router with every content page statically generated, plus one route handler for enquiries. Deploy on Vercel.

## Consequences

- Fast, cacheable HTML for every page in both languages, with proper `<html lang>`, canonical and hreflang tags.
- Uses Next 16 conventions: `proxy.ts` (formerly middleware) and generated `PageProps`/`LayoutProps` types (`npm run typecheck` runs `next typegen` first).
- `global-not-found` is experimental in Next 16 and is needed because there are two root layouts. Re-check it on upgrades.
