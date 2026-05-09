import { test, expect } from "@playwright/test";

/**
 * Smoke tests — MUST pass before every commit that touches src/.
 * Verifies the app actually loads and renders, not just that it builds.
 *
 * Inherited from Caki: proven failure where CSS 404 caused fully broken page,
 * but `npm run build` passed and `curl` returned 200.
 */

test.describe("Smoke tests", () => {
  test("homepage loads and renders", async ({ page }) => {
    await page.goto("/");

    const headline = page.locator("h1");
    await expect(headline).toBeVisible({ timeout: 10_000 });

    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("CSS loads (Tailwind utility class applied)", async ({ page }) => {
    await page.goto("/");
    const main = page.locator("main").first();
    await expect(main).toBeVisible({ timeout: 10_000 });

    const display = await main.evaluate(
      (el) => getComputedStyle(el).display
    );
    expect(display).not.toBe("inline");
  });
});
