import { expect, test, type Page } from "@playwright/test";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

test.describe("homepage call-back card", () => {
  test("validates in the page language and focuses the first problem", async ({ page }) => {
    await page.goto("/hi");
    await page.getByTestId("callback-submit").click();
    await expect(page.getByText("यह फ़ील्ड आवश्यक है।").first()).toBeVisible();
    await expect(page.locator("#callback-parentName")).toBeFocused();
  });

  async function fill(page: Page) {
    await page.locator("#callback-parentName").fill("Test Parent");
    await page.locator("#callback-phone").fill("98765 43210");
    await page.locator("#callback-consent").check();
    await page.waitForTimeout(3200);
  }

  test("never claims success when delivery is not configured", async ({ page }) => {
    await page.goto("/en");
    await fill(page);
    await page.getByTestId("callback-submit").click();
    await expect(page.getByTestId("callback-error")).toContainText("not switched on yet");
    await expect(page.getByTestId("callback-success")).toHaveCount(0);
  });

  test("shows success only after the server confirms", async ({ page }) => {
    let posted: Record<string, unknown> | null = null;
    await page.route("**/api/enquiry", async (route) => {
      posted = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto("/en");
    await fill(page);
    await page.getByTestId("callback-submit").click();
    await expect(page.getByTestId("callback-success")).toBeVisible();
    expect(posted).toMatchObject({
      parentName: "Test Parent",
      topic: "admission",
      consent: true,
      locale: "en",
    });
  });
});

test.describe("search", () => {
  async function openSearch(page: Page) {
    if (isDesktop(page)) await page.getByTestId("search-button").click();
    else await page.getByTestId("mobile-action-bar").getByRole("button").first().click();
    await expect(page.getByTestId("search-dialog")).toBeVisible();
  }

  test("finds a page and navigates to it", async ({ page }) => {
    await page.goto("/en/contact");
    await openSearch(page);
    await expect(page.getByTestId("search-input")).toBeFocused();
    await page.getByTestId("search-input").fill("calendar");
    await page
      .getByTestId("search-dialog")
      .getByRole("link", { name: /Academic Calendar/ })
      .click();
    await expect(page).toHaveURL(/\/en\/academic-calendar$/);
    await expect(page.getByTestId("search-dialog")).toBeHidden();
  });

  test("works in Hindi, accepts English words, explains empty results, closes with Escape", async ({
    page,
  }) => {
    await page.goto("/hi");
    await openSearch(page);
    await page.getByTestId("search-input").fill("book");
    await expect(page.getByTestId("search-dialog").getByRole("link").first()).toHaveAttribute(
      "href",
      "/hi/book-list",
    );
    await page.getByTestId("search-input").fill("zzzz");
    await expect(page.getByTestId("search-empty")).toContainText("कुछ नहीं मिला");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("search-dialog")).toBeHidden();
  });

  test("opens with Ctrl+K and Enter goes to the first result", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Control+k");
    await expect(page.getByTestId("search-dialog")).toBeVisible();
    await page.getByTestId("search-input").fill("public disclosure");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en\/public-disclosure$/);
  });
});

test("mobile action bar: shown on phones and tablets only, Enquire goes to the form", async ({
  page,
}) => {
  await page.goto("/en/about");
  const bar = page.getByTestId("mobile-action-bar");
  if (isDesktop(page)) {
    await expect(bar).toBeHidden();
    return;
  }
  await expect(bar).toBeVisible();
  // No verified phone yet, so no Call/WhatsApp buttons.
  await expect(bar.getByRole("link", { name: /Call|WhatsApp/ })).toHaveCount(0);
  await bar.getByRole("link", { name: "Enquire" }).click();
  await expect(page).toHaveURL(/\/en\/admission#admission-form$/);
  await expect(page.locator("#admission-form-heading")).toBeInViewport();
});

test("rules pages link to their neighbours", async ({ page }) => {
  await page.goto("/en/book-list");
  const pager = page.getByTestId("rules-pager");
  await expect(pager.getByRole("link", { name: /Academic Calendar/ })).toHaveAttribute(
    "href",
    "/en/academic-calendar",
  );
  await expect(pager.getByRole("link", { name: /Teachers List/ })).toHaveAttribute(
    "href",
    "/en/teachers",
  );
});

test("gallery tiles open a full-screen viewer", async ({ page }) => {
  await page.goto("/en/gallery");
  await page.getByTestId("gallery-tile").first().click();
  const dialog = page.getByTestId("gallery-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 of 1");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("judo results become stacked rows on phones and a table on wider screens", async ({
  page,
}) => {
  await page.goto("/en/achievements");
  const narrow = (page.viewportSize()?.width ?? 0) < 640;
  await expect(page.getByTestId("results-list")).toBeVisible({ visible: narrow });
  await expect(page.getByRole("table")).toBeVisible({ visible: !narrow });
});

test("homepage sections appear as they scroll into view", async ({ page }) => {
  await page.goto("/en");
  const heading = page.locator("#home-gallery");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect
    .poll(async () =>
      heading.evaluate((el) => Number(getComputedStyle(el.closest("[data-reveal]")!).opacity)),
    )
    .toBe(1);
});
