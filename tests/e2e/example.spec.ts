import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
	test("should load and display the app title", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("h1")).toContainText("PromptVault");
	});

	test("should display the tagline", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.locator("text=Build better prompts, faster."),
		).toBeVisible();
	});
});
