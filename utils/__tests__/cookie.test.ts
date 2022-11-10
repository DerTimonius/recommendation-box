import { deleteCookie, getCookie, setCookie } from '../cookie';

export type CookieTestType = {
  name: string;
  type: string;
  available: string;
};
test('get, set and delete cookies', () => {
  const cookieValue1 = '123';
  const cookieKey1 = 'abc';
  const cookieKey2 = 'selection';
  const cookieValue2: CookieTestType[] = [
    { name: 'Stranger Things', type: 'TV show', available: 'Netflix' },
    { name: 'The Boys', type: 'TV show', available: 'Amazon Prime' },
  ];

  expect(getCookie(cookieKey1)).toBe(undefined);
  expect(getCookie(cookieKey2)).toBe(undefined);
  expect(() => setCookie(cookieKey1, cookieValue1)).not.toThrow();
  expect(() => setCookie(cookieKey2, cookieValue2)).not.toThrow();
  expect(getCookie(cookieKey1)).toStrictEqual(cookieValue1);
  expect(getCookie(cookieKey2)).toStrictEqual(cookieValue2);
  expect(deleteCookie(cookieKey1)).toBe(undefined);
  expect(deleteCookie(cookieKey2)).toBe(undefined);
  expect(getCookie(cookieKey1)).toBe(undefined);
  expect(getCookie(cookieKey2)).toBe(undefined);
});
