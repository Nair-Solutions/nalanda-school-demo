# Content migration map

Source-to-destination map from the original site to the new routes. **Only verified URLs are listed.** The original site was unreachable from the build environment (see [`original-website-audit.md`](original-website-audit.md)), so most rows are "investigate".

Every new route exists in both languages: `/en/<slug>` and `/hi/<slug>`.

| Original URL                              | New route                            | Content status                                       | Migration action                                                                                                                     |
| ----------------------------------------- | ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `https://www.nalandakurud.in/`            | `/` (language choice) → `/en`, `/hi` | Original not inspected                               | Investigate; homepage rebuilt from verified facts                                                                                    |
| `https://www.nalandakurud.in/guidelines/` | `/{locale}/guidelines`               | URL verified (from the brief); content not inspected | Redirect implemented (`/guidelines` → `/{locale}/guidelines`); migrate the text or PDF; meanwhile the new page links to the original |
| Academic Calendar (URL unknown)           | `/{locale}/academic-calendar`        | Unavailable                                          | Investigate → migrate the PDF → add a redirect                                                                                       |
| Book List (URL unknown)                   | `/{locale}/book-list`                | Unavailable                                          | Investigate → migrate → redirect                                                                                                     |
| Teachers List (URL unknown)               | `/{locale}/teachers`                 | Unavailable                                          | Investigate → migrate → redirect                                                                                                     |
| Public Disclosure (URL unknown)           | `/{locale}/public-disclosure`        | Unavailable                                          | Investigate → migrate → redirect                                                                                                     |
| About (URL unknown)                       | `/{locale}/about`                    | Unavailable                                          | Investigate                                                                                                                          |
| Admission (URL unknown)                   | `/{locale}/admission`                | Unavailable                                          | Investigate                                                                                                                          |
| Facilities (URL unknown)                  | `/{locale}/facilities`               | Unavailable                                          | Investigate                                                                                                                          |
| Gallery (URL unknown)                     | `/{locale}/gallery`                  | Unavailable                                          | Investigate; photos need permission                                                                                                  |
| Contact (URL unknown)                     | `/{locale}/contact`                  | Unavailable                                          | Investigate; verify phone, email and address                                                                                         |
| Activities (seen only in the demo)        | —                                    | Unverified                                           | Investigate whether the original has this page                                                                                       |
| PTA (seen only in the demo)               | —                                    | Unverified                                           | Investigate whether the original has this page                                                                                       |
| Parent portal (unknown)                   | —                                    | Unverified                                           | Link only after verifying the real portal                                                                                            |
| — (new)                                   | `/{locale}/rules-and-regulations`    | New hub page                                         | —                                                                                                                                    |
| — (new)                                   | `/{locale}/achievements`             | Verified (poster)                                    | —                                                                                                                                    |
| — (new)                                   | `/{locale}/privacy`                  | New (describes this site's own data handling)        | —                                                                                                                                    |

## How to add a redirect

Add the old path (no trailing slash, lower-case) to `legacyRedirects` in `src/content/routes.ts`:

```ts
export const legacyRedirects: Record<string, PageSlug> = {
  "/guidelines": "guidelines",
  "/academic-calendar-2026-27": "academic-calendar", // example
};
```

The proxy sends visitors to the same page in their saved language (English by default) with a permanent 308 redirect.

## How to publish a document

1. Put the file in `public/documents/` with a descriptive name, e.g. `academic-calendar-2026-27.pdf`.
2. Add an entry to `src/content/documents.ts`:

```ts
{ id: "calendar-2026-27", page: "academic-calendar", title: "Academic Calendar 2026–27",
  file: "/documents/academic-calendar-2026-27.pdf", source: "https://www.nalandakurud.in/…" }
```

The page then lists the document with View and Download buttons, and its card changes from "Being updated" to "Available".
