# ADR 0004: Static security headers

- Status: Accepted (2026-10-25)

## Decision

Set in `next.config.ts` for every response: CSP (`default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob:`, `font-src 'self'`, `connect-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`), HSTS (2 years), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`. `poweredByHeader` is off.

`'unsafe-inline'` for scripts is needed because Next.js inlines bootstrap scripts. Nonce-based CSP would make every page dynamic, losing static generation. There is no user-generated HTML anywhere, and JSON-LD is escaped (`src/lib/json-ld.ts`). There is no `unsafe-eval` in production; Zod runs in `jitless` mode so its JIT probe doesn't trip the CSP. The e2e suite fails on any CSP violation.

## Consequences

Any future third-party embed (maps iframe, analytics, YouTube) must be added to the CSP deliberately.
