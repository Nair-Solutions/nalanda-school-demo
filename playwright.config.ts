import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } },
    },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 }, hasTouch: true },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Tests run against the production build. Run `npm run build` first.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}/en`,
        reuseExistingServer: !process.env.CI,
        // Every test posts from 127.0.0.1, so lift the per-IP enquiry limit for the test server only.
        env: { ENQUIRY_RATE_LIMIT: "1000" },
        timeout: 60_000,
      },
});
