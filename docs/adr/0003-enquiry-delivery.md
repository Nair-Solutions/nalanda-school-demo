# ADR 0003: Enquiry delivery via email or webhook, never a fake success

- Status: Accepted (2026-10-25)

## Decision

`POST /api/enquiry`:

1. Same-origin check (Origin vs Host), 8 KB body limit.
2. Best-effort per-IP rate limit (5 per 10 minutes, in memory).
3. Spam traps: a hidden honeypot field (bots get a silent 200 and nothing is sent) and a minimum fill time of 3 s.
4. Zod validation (the same schema as the client). Returns per-field error codes.
5. Delivery, chosen by environment variables:
   - `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` + `ENQUIRY_FROM_EMAIL`: plain-text email via Resend's REST API, with `reply_to` set to the parent's email if given.
   - else `ENQUIRY_WEBHOOK_URL` (+ `ENQUIRY_WEBHOOK_SECRET`): JSON POST, e.g. to a Google Apps Script that appends to a Sheet (see `docs/integrations/google-sheets-webhook.gs`).
   - else **503 `notConfigured`**: the form tells the visitor online enquiries aren't switched on yet.

No database: the site stores no personal data itself.

## Consequences / limits

- The in-memory rate limiter is per serverless instance, so it is not a global guarantee. If abuse appears, add Vercel Firewall rules, Cloudflare Turnstile, or an Upstash Redis limiter.
- Data minimisation: only name and phone are required. Email, student name, class and message are optional. A consent checkbox links to the privacy notice.
