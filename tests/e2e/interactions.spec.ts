import { expect, test } from "@playwright/test";

test("achievers poster opens in a viewer and closes with Escape", async ({ page }) => {
  await page.goto("/en/achievements");
  await page.getByTestId("poster-open").click();
  const dialog = page.getByTestId("poster-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /full-resolution/ })).toHaveAttribute(
    "href",
    /judo-achievers-2026/,
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Rashi Sahu").first()).toBeAttached();
});

test("full-resolution poster file is served", async ({ request }) => {
  const res = await request.get("/images/achievements/judo-achievers-2026.webp");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/webp");
});

test.describe("enquiry form", () => {
  test("shows translated validation errors and focuses the first invalid field", async ({
    page,
  }) => {
    await page.goto("/hi/contact");
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByText("यह फ़ील्ड आवश्यक है।").first()).toBeVisible();
    await expect(page.getByText("कृपया सहमति दें, ताकि विद्यालय आपको उत्तर दे सके।")).toBeVisible();
    await expect(page.locator("#contact-parentName")).toBeFocused();
    await expect(page.locator("#contact-parentName")).toHaveAttribute("aria-invalid", "true");

    await page.locator("#contact-phone").fill("12345");
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByText("10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।")).toBeVisible();
  });

  async function fillValid(page: import("@playwright/test").Page) {
    await page.locator("#admission-parentName").fill("Test Parent");
    await page.locator("#admission-phone").fill("+91 98765 43210");
    await page.locator("#admission-studentClass").fill("Class 6");
    await page.locator("#admission-message").fill("Automated test enquiry");
    await page.locator("#admission-consent").check();
    // The server rejects forms submitted faster than a person could fill them.
    await page.waitForTimeout(3200);
  }

  test("does not claim success when delivery is not configured", async ({ page }) => {
    await page.goto("/en/admission");
    await fillValid(page);
    await page.getByTestId("enquiry-submit").click();
    // In this test environment no provider is configured, so the honest error must appear.
    await expect(page.getByTestId("enquiry-error")).toContainText("not switched on yet");
    await expect(page.getByTestId("enquiry-success")).toHaveCount(0);
  });

  test("shows success only after the server confirms delivery", async ({ page }) => {
    let posted: Record<string, unknown> | null = null;
    await page.route("**/api/enquiry", async (route) => {
      posted = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto("/en/admission");
    await fillValid(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("enquiry-success")).toBeVisible();
    expect(posted).toMatchObject({
      parentName: "Test Parent",
      topic: "admission",
      consent: true,
      locale: "en",
    });
  });

  test("shows a network error when the request fails", async ({ page }) => {
    await page.route("**/api/enquiry", (route) => route.abort());
    await page.goto("/en/admission");
    await fillValid(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("enquiry-error")).toContainText("Could not connect");
  });
});
