import { expect, test } from "@playwright/test";

test("logo navigates to the homepage", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByTestId("logo-home").click();
  await expect(page).toHaveURL(/\/en$/);
});

test.describe("desktop navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, "desktop only");

  test("Rules & Regulations dropdown works with mouse and keyboard", async ({ page }) => {
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const trigger = nav.getByRole("button", { name: "Rules & Regulations" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    for (const label of [
      "Guidelines",
      "Academic Calendar",
      "Book List",
      "Teachers List",
      "Mandatory Public Disclosure",
    ]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }

    // Outside click closes.
    await page.locator("h1").click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Keyboard: ArrowDown opens and focuses the first item, arrows move, Escape closes and refocuses.
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Rules & Regulations" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(nav.getByRole("link", { name: "Guidelines" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    // Each item goes to its own page.
    await trigger.click();
    await nav.getByRole("link", { name: "Teachers List" }).click();
    await expect(page).toHaveURL(/\/en\/teachers$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Teachers List");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("active page is marked", async ({ page }) => {
    await page.goto("/en/gallery");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Gallery" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, "mobile/tablet only");

  test("menu opens, navigates, closes and switches language", async ({ page }) => {
    await page.goto("/en");
    const button = page.getByTestId("menu-button");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(menu.getByRole("link", { name: "Mandatory Public Disclosure" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await button.click();
    await menu.getByRole("link", { name: "Academic Calendar" }).click();
    await expect(page).toHaveURL(/\/en\/academic-calendar$/);
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await button.click();
    await menu.getByTestId("language-toggle").click();
    await expect(page).toHaveURL(/\/hi\/academic-calendar$/);
    await page.getByTestId("menu-button").click();
    await expect(
      page
        .getByRole("navigation", { name: "मोबाइल नेविगेशन" })
        .getByRole("link", { name: "शैक्षणिक कैलेंडर" }),
    ).toBeVisible();
  });
});

test("every internal link on every page resolves", async ({ page, request }) => {
  test.slow();
  const seen = new Set<string>();
  const queue = ["/en", "/hi"];
  const external = new Set<string>();
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    await page.goto(path);
    const hrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(page.url()).origin) {
        external.add(href);
        continue;
      }
      const target = url.pathname;
      if (!seen.has(target) && !queue.includes(target)) {
        if (/\.\w+$/.test(target)) {
          expect((await request.get(target)).status(), target).toBe(200);
          seen.add(target);
        } else queue.push(target);
      }
    }
    if (!/\.\w+$/.test(path)) expect((await request.get(path)).status(), path).toBe(200);
  }
  expect(seen.size).toBeGreaterThanOrEqual(30);
  test
    .info()
    .annotations.push({ type: "external-links", description: [...external].sort().join(", ") });
});
