import { validateInput } from '../validateInput';

test("check if input has no ' ' in int", () => {
  expect(validateInput('abc123')).toBe(true);
  expect(validateInput('abc 123')).toBe(false);
  expect(validateInput(' abc123')).toBe(false);
  expect(validateInput('abc123 ')).toBe(false);
  expect(validateInput('a bc 12 3')).toBe(false);
});
