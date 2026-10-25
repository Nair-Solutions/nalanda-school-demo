# ADR 0005: Content as typed files, no CMS (for now)

- Status: Accepted (2026-10-25)

## Context

School content (calendar, book list, teacher list, disclosures, notices) changes a few times a year, mostly as PDFs.

## Decision

Keep content in `src/content/*.ts` and PDFs in `public/documents/`. Updates go through Git: edit, push, Vercel deploys a preview, merge to publish. The agency (N.A.I.R. Solutions) makes changes on request from the school.

## When to revisit

If school staff need to publish notices themselves weekly:

- **Cheapest:** a Google Sheet (notices, documents) read at build time, plus a Vercel Deploy Hook the staff can trigger. ₹0.
- **Managed CMS:** Sanity or Decap CMS (Git-based, free) with a protected editor login.
  Either way, don't build a custom admin panel or authentication system.
