# Product

## Platform

web

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Motion · Vercel.
Bilingual routes `/en/*` and `/hi/*`; typed dictionaries in `src/i18n/dictionaries/`.

## Users

- **Parents and guardians** in and around Bhilai, Chhattisgarh, deciding on admission or looking up school information. Many read Hindi first; most visit on a mid-range Android phone, often outdoors or on mobile data.
- **Current families** looking for a document quickly: the academic calendar, book list, guidelines or a notice.
- **Inspectors and the public** checking the mandatory public disclosure.
- **School staff** who share links to pages and documents (WhatsApp is the main channel).

## Product Purpose

Help a family understand the school in seconds, find any public document without hunting, and reach the school office: an enquiry that genuinely arrives, or a call.

## Positioning

The official website of Nalanda English Medium Higher Secondary School, Bhilai. An English-medium school teaching up to Class 12. It must read as calm, credible and well kept: an institution, not a marketing campaign.

## Operating Context

- Phones first (360–414px wide), slow networks, bright daylight. Light theme; large type.
- Two languages with equal standing. Every interface string exists in English and Hindi; Devanagari needs extra line height and no letter-spacing.
- Content arrives from the school in pieces (PDFs, photos, numbers). Pages must look finished when a piece is missing and switch on automatically when it arrives.

## Capabilities and Constraints

- Statically generated pages; one serverless endpoint (`/api/enquiry`) delivering by email (Resend) or a webhook (Google Sheet). No database, no login, no trackers.
- Strict CSP: no third-party scripts, fonts or embeds without a deliberate CSP change.
- No 3D (no 3D model exists). No dark theme. Glass only as a caption strip over real photographs.

## Brand Commitments

- The official logo and emblem are used as supplied, never redrawn.
- Colours from the logo: navy `#002D67`, crimson `#82040E`; gold `#C8973A` only for the motto and medals.
- Motto: "Run your race to win" (kept in English in both languages).
- The school name is never translated incorrectly; Hindi pages use the transliteration नालंदा इंग्लिश मीडियम हायर सेकेंडरी स्कूल.

## Evidence on Hand

- Official logo (2000×218) and the emblem cropped from it.
- Judo Achievers 2026 poster (five medal results, CBSE Far East Zone Judo Championship 2026).
- Two Google Maps photo collections (external links only).
- Not yet supplied: campus photographs, phone/email/address, documents (calendar, book list, teachers list, public disclosure), notices, admission details.

## Product Principles

1. **Never invent a fact.** No awards, numbers, testimonials, facilities or contact details that the school has not confirmed. Missing content shows as "being updated".
2. **The working action first.** The enquiry/call-back is usable on the first screen.
3. **Documents are one tap away** from every page.
4. **Honest states.** A form shows success only after delivery succeeded.
5. **Quiet confidence.** One accent, large type, real pictures; no ornament.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast ≥ 4.5:1, visible focus, 44px touch targets, keyboard-complete, `lang` set per page (`en-IN` / `hi-IN`), reduced-motion respected, no information by colour alone. Hindi is a first-class language, not a translation layer.
