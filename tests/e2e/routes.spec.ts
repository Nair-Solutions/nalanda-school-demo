import { expect, test } from "@playwright/test";
import { allPaths, allowedLatinOnHindi } from "./helpers";

for (const path of allPaths) {
  test(`renders ${path} cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

    await page.addInitScript(() => {
      const w = window as unknown as { __csp: string[] };
      w.__csp = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
      );
    });

    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const locale = path.split("/")[1];
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "hi" ? "hi-IN" : "en-IN");
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${path}$`),
    );

    // No horizontal scrolling at this viewport.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Every image actually loaded.
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        // Only images displayed at this viewport (responsive variants are display:none).
        .filter((img) => img.checkVisibility())
        .filter(
          (img) => img.loading !== "lazy" || img.getBoundingClientRect().top < window.innerHeight,
        )
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(broken).toEqual([]);

    // No dead "#" links or empty hrefs.
    const deadLinks = await page.locator('a[href="#"], a[href=""], a:not([href])').count();
    expect(deadLinks).toBe(0);

    if (locale === "hi") {
      const text = await page.evaluate(() => {
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone
          .querySelectorAll('[lang="en"], script, style, [aria-hidden="true"]')
          .forEach((n) => n.remove());
        return clone.innerText;
      });
      const stray = (text.match(/[A-Za-z_]{2,}/g) ?? []).filter(
        (w) => !allowedLatinOnHindi.has(w.toLowerCase()),
      );
      expect(stray, "English words on a Hindi page").toEqual([]);
    }

    expect(errors).toEqual([]);
    expect(
      await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp),
      "CSP violations",
    ).toEqual([]);
  });
}

test("page titles are unique per locale", async ({ request }) => {
  const titles = new Map<string, string>();
  for (const path of allPaths) {
    const html = await (await request.get(path)).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    expect(
      titles.has(title),
      `duplicate title "${title}" on ${path} and ${titles.get(title)}`,
    ).toBe(false);
    titles.set(title, path);
  }
});

test("unknown pages return 404", async ({ request }) => {
  expect((await request.get("/en/does-not-exist")).status()).toBe(404);
  expect((await request.get("/does-not-exist")).status()).toBe(404);
  expect((await request.get("/fr")).status()).toBe(404);
});

test("legacy and locale-less URLs redirect", async ({ request }) => {
  const res = await request.get("/guidelines/", { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(res.status());
  const final = await request.get("/guidelines/");
  expect(final.url()).toMatch(/\/en\/guidelines$/);
  const contact = await request.get("/contact", { headers: { cookie: "NEXT_LOCALE=hi" } });
  expect(contact.url()).toMatch(/\/hi\/contact$/);
});

test("sitemap and robots list every page", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of allPaths) expect(sitemap).toContain(`${path}</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");
});
