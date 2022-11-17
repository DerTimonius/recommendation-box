import { expect, test } from '@playwright/test';

test('register user, change preferences and password, and delete user', async ({
  page,
}) => {
  test.slow();
  await page.goto('http://localhost:3000');
  // register a user
  await page.locator(`[data-test-id="navigation-register"]`).click();
  await page.getByLabel('Username').fill('playwright_test_user');
  await page
    .getByRole('textbox', { name: 'Password' })
    .fill('playwright_test_user');
  await page.getByLabel(`Confirm Password`).fill('playwright_test_user');
  await page.locator(`[data-test-id="register-user"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/profile');
  await expect(page.locator(`[data-test-id="profile-greeting"]`)).toHaveText(
    'Hello playwright_test_user',
  );
  // check the preferences
  await page.locator(`[data-test-id="profile-preferences"]`).click();
  await expect(
    page.getByLabel('Exclude bollywood movies from search results'),
  ).not.toBeChecked();
  await page.getByLabel('Exclude bollywood movies from search results').check();
  await page.locator(`[data-test-id="change-preferences-button"]`).click();
  // close the accordion an open it again to check if the change happened
  await page.locator(`[data-test-id="profile-preferences"]`).click();
  await page.locator(`[data-test-id="profile-preferences"]`).click();
  await expect(
    page.getByLabel('Exclude bollywood movies from search results'),
  ).toBeChecked();
  await page.locator(`[data-test-id="profile-preferences"]`).click();

  // change the password
  await page.locator(`[data-test-id="profile-change-password"]`).click();
  await page
    .getByRole('textbox', { name: 'Current Password' })
    .fill('playwright_test_user');
  await page
    .getByRole('textbox', { name: `New Password` })
    .fill('changed_password');
  await page.getByLabel(`Confirm New Password`).fill('changed_password');
  await page.locator(`[data-test-id="change-password-button"]`).click();
  await expect(
    page.locator(`[data-test-id="change-password-button"]`),
  ).toHaveText('Saved');
  await page.locator(`[data-test-id="profile-change-password"]`).click();

  // delete the fake user again
  await page.locator(`[data-test-id="profile-delete-account"]`).click();
  await page
    .locator(`[data-test-id="delete-user-password"] input[type="password"]`)
    .fill('changed_password');
  await page.locator(`[data-test-id="delete-user-button"]`).click();
  await expect(page).toHaveURL('http://localhost:3000/');
});
