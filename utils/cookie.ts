import cookie from 'cookie';
import Cookies from 'js-cookie';
import { Session } from '../database/sessions';
import { Movie } from '../pages/movies';

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
export function setCookie(key: string, value: Movie[]) {
  return Cookies.set(key, JSON.stringify(value));
}

export function deleteCookie(key: string) {
  return Cookies.remove(key);
}
