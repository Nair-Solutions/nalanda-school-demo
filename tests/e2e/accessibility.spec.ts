import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allPaths } from "./helpers";

// @axe-core/playwright is typed against a newer playwright-core than the pinned test runner.
type AxePage = ConstructorParameters<typeof AxeBuilder>[0]["page"];

test.describe("axe accessibility scan", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, "scan once, on desktop");

  for (const path of ["/", ...allPaths]) {
    test(`no WCAG A/AA violations on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page: page as unknown as AxePage })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 3)
            .join(" | ")}`,
      );
      expect(summary).toEqual([]);
    });
  }
});
