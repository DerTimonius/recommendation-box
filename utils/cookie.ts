import cookie from 'cookie';
import Cookies from 'js-cookie';
import { Session } from '../database/sessions';
import { Movie } from '../pages/movies';
import { CookieTestType } from './__tests__/cookie.test';

const isProduction = process.env.NODE_ENV === 'production';

export function createSessionCookie(token: Session['token']) {
  return cookie.serialize('sessionToken', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // valid for 24 hours
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  });
}

export function getCookie(key: string) {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) {
    return undefined;
  }
  try {
    return JSON.parse(cookieValue);
  } catch {
    return undefined;
  }
}
export function setCookie(
  key: string,
  value: Movie[] | CookieTestType[] | string,
) {
  return Cookies.set(key, JSON.stringify(value), {
    sameSite: 'lax',
    expires: 1,
  });
}

export function deleteCookie(key: string) {
  return Cookies.remove(key);
}
