import { expect, test } from "@playwright/test";

// seeded user
const email = process.env.E2E_EMAIL ?? "test@test.com";
const password = process.env.E2E_PASSWORD ?? "Testpassword123";

test("should visit login page and log in", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByPlaceholder("********").fill(password);
  await page.getByRole("button", { name: /^Sign in$/ }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Dashboard Page")).toBeVisible();
});
