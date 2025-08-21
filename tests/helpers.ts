import { expect, Page } from '@playwright/test';

export async function waitForMovies(page: Page, selector = '#popular-movies .movie-card') {
  await expect(page.locator(selector).first()).toBeVisible({ timeout: 20_000 });
}
