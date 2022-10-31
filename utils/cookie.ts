import cookie from 'cookie';
import { Session } from '../database/sessions';

const isProduction = process.env.NODE_ENV === 'production';

export function cretaeSessionCookie(token: Session['token']) {
  return cookie.serialize('sessionToken', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // valid for 24 hours
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  });
}
