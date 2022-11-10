import {
  createCsrfSecret,
  createTokenFromSecret,
  validateTokenFromCsrfSecret,
} from '../csrf';

test('create and check csrf token', () => {
  const csrfSecret = createCsrfSecret();
  expect(csrfSecret).not.toBe(undefined);
  const csrfToken = createTokenFromSecret(csrfSecret);
  expect(csrfToken).not.toBe(undefined);
  expect(validateTokenFromCsrfSecret(csrfSecret, csrfToken)).toBe(true);
  expect(
    validateTokenFromCsrfSecret(
      csrfSecret,
      'gibberishstringwithnumbers137897324891',
    ),
  ).toBe(false);
});
