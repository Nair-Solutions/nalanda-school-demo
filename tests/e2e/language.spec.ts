import { expect, test } from "@playwright/test";

test("first visit shows the language chooser, and the choice persists", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Choose your language");
  await page.getByTestId("choose-hi").click();
  await expect(page).toHaveURL(/\/hi$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("नालंदा");

  const cookie = (await context.cookies()).find((c) => c.name === "NEXT_LOCALE");
  expect(cookie?.value).toBe("hi");

  // Returning visitor skips the chooser.
  await page.goto("/");
  await expect(page).toHaveURL(/\/hi$/);
});

test("toggle switches language on the same page and back/forward works", async ({
  page,
  context,
}) => {
  await page.goto("/en/book-list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Book List");
  await page.getByTestId("language-toggle").first().click();
  await expect(page).toHaveURL(/\/hi\/book-list$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("पुस्तक सूची");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");
  expect((await context.cookies()).find((c) => c.name === "NEXT_LOCALE")?.value).toBe("hi");

  await page.getByTestId("language-toggle").first().click();
  await expect(page).toHaveURL(/\/en\/book-list$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Book List");

  await page.goBack();
  await expect(page).toHaveURL(/\/hi\/book-list$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/en\/book-list$/);
});
