import { expect, test } from "@playwright/test";

test("homepage shows OOGO brand story", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "OOGO", exact: true })).toBeVisible();
  await expect(page.getByText("빛과 얼굴, 조용한 태도를 위한 프레임.").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/oogolaps"
  );
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveAttribute(
    "href",
    "https://www.facebook.com/oogolaps"
  );
  await expect(page.getByRole("link", { name: "TikTok" })).toHaveAttribute(
    "href",
    "https://www.tiktok.com/@oogolaps"
  );
});

test("homepage links to the featured project", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "프로젝트 보기" }).click();

  await expect(page).toHaveURL(/\/projects\/youngbin-edition$/);
  await expect(page.locator("h1", { hasText: "Youngbin Edition" })).toBeVisible();
});

test("collection page links products to detail pages", async ({ page }) => {
  await page.goto("/collection");

  await expect(page.getByRole("heading", { name: "Sunglasses" })).toBeVisible();
  await page.getByRole("link", { name: "황혼의 산책", exact: true }).click();

  await expect(page).toHaveURL(/\/products\/og26001c2$/);
  await expect(page.getByRole("heading", { name: "황혼의 산책" })).toBeVisible();
});

test("product detail presents buyer-focused views and actions", async ({ page }) => {
  await page.goto("/products/og26001c2");

  await expect(page.getByRole("heading", { name: "황혼의 산책" })).toBeVisible();
  await expect(page.locator(".product-detail-media-front")).toBeVisible();
  await expect(page.locator(".product-detail-media-angle")).toBeVisible();
  await expect(page.locator(".product-detail-media-side")).toBeVisible();
  await expect(page.locator(".product-detail-media-wearing")).toBeVisible();
  await expect(page.getByRole("link", { name: "바이어 문의" })).toHaveAttribute("href", "/inquiry");
});
