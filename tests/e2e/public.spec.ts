import { expect, test } from "@playwright/test";

test("homepage shows OOGO brand story", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "OOGO" })).toBeVisible();
  await expect(page.getByText("Light, framed softly")).toBeVisible();
  await expect(page.getByText("Quiet confidence, shaped for everyday light.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/oogolabs"
  );
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveAttribute(
    "href",
    "https://www.facebook.com/oogolabs"
  );
  await expect(page.getByRole("link", { name: "TikTok" })).toHaveAttribute(
    "href",
    "https://www.tiktok.com/@oogolabs"
  );
});

test("special edition opens a campaign modal", async ({ page }) => {
  await page.goto("/");

  await page.locator("#special").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Explore Youngbin Edition" }).click();

  await expect(page.getByRole("dialog", { name: "Youngbin Edition" })).toBeVisible();
  await expect(page.getByText("Request special edition catalog")).toBeVisible();
});

test("product catalog opens quick view modal", async ({ page }) => {
  await page.goto("/products");

  await page.locator(".catalog-grid").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Quick view 황혼의 산책" }).click();

  await expect(page.getByRole("dialog", { name: "황혼의 산책" })).toBeVisible();
  await expect(page.getByLabel("황혼의 산책 wearing impression")).toBeVisible();
  await expect(page.getByText("Front balance")).toBeVisible();
  await expect(page.getByText("Side profile")).toBeVisible();
  await expect(page.getByRole("link", { name: "Request buyer catalog" })).toHaveAttribute("href", "/#inquiry");
  await expect(page.getByText("View full details")).toHaveCount(0);
});

test("product detail presents buyer-focused views and actions", async ({ page }) => {
  await page.goto("/products/og26001c2-sunset-stroll");

  await expect(page.getByRole("heading", { name: "황혼의 산책" })).toBeVisible();
  await expect(page.getByLabel("황혼의 산책 wearing impression")).toBeVisible();
  await expect(page.getByText("Front balance")).toBeVisible();
  await expect(page.getByText("Side profile")).toBeVisible();
  await expect(page.getByRole("link", { name: "Request buyer catalog" })).toHaveAttribute("href", "/#inquiry");
});
