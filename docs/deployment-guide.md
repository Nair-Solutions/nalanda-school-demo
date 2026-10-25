# Deployment guide (Vercel)

**Current status: not deployed.** This environment cannot reach `api.vercel.com`, and no Vercel token is configured. These steps are for the repository owner.

## 1. Import the repository (one time, ~5 minutes)

1. Sign in at <https://vercel.com> with the GitHub account that can see `nair-solutions/nalanda-school-demo`.
2. **Add New → Project → Import** `nair-solutions/nalanda-school-demo`.
3. Framework preset: **Next.js** (auto-detected). Leave the build command (`next build`), output and install command as the defaults. Node.js version: 22.x.
4. Add environment variables (Project → Settings → Environment Variables). Never commit them:

| Variable                           | Environments                                     | Value                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | Production                                       | `https://www.nalandakurud.in` **once the domain points to Vercel**. Until then, leave it unset (Vercel's production URL is used automatically). |
| Option A: `RESEND_API_KEY`         | Production (and Preview if you want test emails) | From resend.com → API Keys                                                                                                                      |
| Option A: `ENQUIRY_TO_EMAIL`       | Production, Preview                              | The school-confirmed inbox (comma-separate several)                                                                                             |
| Option A: `ENQUIRY_FROM_EMAIL`     | Production, Preview                              | e.g. `Nalanda Website <enquiries@nalandakurud.in>`. The domain must be verified in Resend (DNS records)                                         |
| Option B: `ENQUIRY_WEBHOOK_URL`    | Production, Preview                              | Google Apps Script web-app URL (`docs/integrations/google-sheets-webhook.gs`)                                                                   |
| Option B: `ENQUIRY_WEBHOOK_SECRET` | Production, Preview                              | Long random string, also saved in the script's properties                                                                                       |

If both options are set, Resend is used. If neither is set, the form shows "online enquiries are not switched on yet".

5. **Deploy.** The first deploy of the default branch becomes Production. To start with previews only, import the project while the work lives on the feature branch and merge to `main` only after approval.

## 2. Preview deployments

Every push to a non-production branch (e.g. `claude/stoic-turing-gmzipd`) gets its own preview URL, shown in the Vercel dashboard and on the GitHub PR. Test it against [`production-checklist.md`](production-checklist.md).

To run the full e2e suite against a preview:

```bash
E2E_BASE_URL=https://<preview-url> npx playwright test
```

(If Vercel Deployment Protection is on, use a protection-bypass token or test while logged in.)

## 3. Production

Merging the PR into `main` deploys production. **Get the school's approval first.**

## 4. Connecting `nalandakurud.in` (only with the domain owner's permission)

Don't change DNS until the school approves the switch, and until the content still living on the old site (guidelines, PDFs) has been migrated. The new Guidelines page links to the old site's `/guidelines/`, which would stop working after the switch.

1. Vercel → Project → Settings → **Domains** → add `www.nalandakurud.in` and `nalandakurud.in` (set the apex to redirect to `www`).
2. At the domain's DNS provider, the domain owner adds the records Vercel shows. Typically:
   - `www` → **CNAME** → the `…vercel-dns.com` target Vercel displays
   - apex `@` → **A** → the IP Vercel displays
     Use the exact values from the dashboard, which can change. Remove conflicting old A/CNAME records for the same names, but **keep MX/TXT records** so school email isn't affected.
3. Wait for Vercel to show "Valid configuration" (HTTPS certificates are issued automatically).
4. Set `NEXT_PUBLIC_SITE_URL=https://www.nalandakurud.in` and redeploy, so canonical URLs, the sitemap and Open Graph tags use the real domain.
5. Submit `https://www.nalandakurud.in/sitemap.xml` in Google Search Console.

## 5. Rollback

Vercel → Deployments → choose the previous production deployment → **Promote to Production**.
