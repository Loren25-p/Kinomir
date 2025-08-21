import { test, expect } from '@playwright/test';

test('loads home and shows hero', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#hero-title')).toBeVisible();
});

test('search works and updates list', async ({ page }) => {
  await page.goto('/index.html');
  const input = page.locator('#search-input');
  await input.fill('Matrix');
  await page.waitForTimeout(700);
  await expect(page.locator('#popular-movies .movie-card').first()).toBeVisible();
});

test('open modal from card and close it', async ({ page }) => {
  await page.goto('/index.html');
  const firstCard = page.locator('#popular-movies .movie-card').first();
  await firstCard.click();
  await expect(page.locator('#modal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).toBeHidden();
});

