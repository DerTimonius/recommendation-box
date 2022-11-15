import { expect, test } from '@playwright/test';

test('register user, search for movies, get recommendations, save them and delete user', async ({
  page,
}) => {
  // since this is a very long test, set the test timeout
  test.slow();
  await page.goto('http://localhost:3000/');
  await page.locator(`[data-test-id="navigation-movies"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/movies');
  await expect(page.locator('h3')).toHaveText(
    'Do you also want to get recommendations based on multiple movies?',
  );
  await page.locator(`[data-test-id="movie-register-link"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/register');
  // register a user
  await page.getByLabel('Username').fill('playwright_test_user2');
  await page
    .getByRole('textbox', { name: 'Password' })
    .fill('playwright_test_user2');
  await page.getByLabel(`Confirm Password`).fill('playwright_test_user2');
  await page.locator(`[data-test-id="register-user"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/profile');
  await page.locator(`[data-test-id="navigation-movies"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/movies');
  // search for movies/TV shows and add them to the selection
  await page.getByLabel('Search Movie/TV Show').fill('The Expanse');
  await page.locator(`[data-test-id="search-movie"]`).click();
  await expect(
    page.locator(`[data-test-id^="search-result-movie"]`),
  ).toHaveCount(7);
  await page.locator(`[data-test-id="add-search-result-The Expanse"]`).click();
  // check if the button is disabled after adding the movie/TV show to the selection
  await expect(
    page.locator(`[data-test-id="add-search-result-The Expanse"]`),
  ).toBeDisabled();
  await page.getByLabel('Search Movie/TV Show').fill('Stranger Things');
  await page.locator(`[data-test-id="search-movie"]`).click();
  await page
    .locator(`[data-test-id="add-search-result-Stranger Things"]`)
    .click();
  await page.getByLabel('Search Movie/TV Show').fill('Marianne');
  await page.locator(`[data-test-id="search-movie"]`).click();
  await page.locator(`[data-test-id="add-search-result-Marianne"]`).click();
  await expect(page.locator(`[data-test-id^="selected-movie"]`)).toHaveCount(3);
  await page.locator(`[data-test-id="get-recommendations-button"]`).click();
  await expect(
    page.locator(`[data-test-id^="recommended-movie-"]`),
  ).toHaveCount(3, { timeout: 100000 });
  // save the recommendations, click on new to check if the search bar appears again
  await page.locator(`[data-test-id="save-recommendations-button"]`).click();
  await page.locator(`[data-test-id="new-recommendations-button"]`).click();
  await expect(page.getByLabel('Search Movie/TV Show')).toBeVisible();

  // delete the user again
  await page.locator(`[data-test-id="navigation-profile"]`).click();
  await expect(page.locator(`[data-test-id^="saved-movie-"]`)).toHaveCount(3, {
    timeout: 100000,
  });
  await page.locator(`[data-test-id="profile-delete-account"]`).click();
  await page.getByLabel('Enter your password').fill('playwright_test_user2');
  await page.locator(`[data-test-id="delete-user-button"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/');
});
