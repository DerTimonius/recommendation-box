import { expect, test } from '@playwright/test';

test('page navigation test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // await expect(page.locator("h1")).toHaveText("I don't know yet");
  await expect(page).toHaveTitle('Movie Recommendations');

  await expect(page.locator(`[data-test-id="trending-card"]`)).toHaveCount(10);
  await page.locator(`[data-test-id="navigation-about"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await page.locator(`[data-test-id="navigation-movies"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/movies');
  await expect(page.locator('h3')).toHaveText(
    'Do you also want to get recommendations based on multiple movies?',
  );
  await page.locator(`[data-test-id="navigation-login"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await page.locator(`[data-test-id="navigation-register"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/register');
});
