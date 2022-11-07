import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { getUserWithPasswordByUsername, User } from '../../database/user';
import { createSessionCookie } from '../../utils/cookie';
import { createCsrfSecret } from '../../utils/csrf';
import { Error } from './register';

export type LoginResponseType =
  | { errors: Error }
  | { user: { username: User['username'] } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // check the method
  if (request.method === 'POST') {
    // validate the input
    const username = request.body.username;
    const password = request.body.password;
    if (
      !password ||
      !username ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return response
        .status(401)
        .json({ errors: { message: 'Username and/or password missing' } });
    }
    // get the user from the database
    const user = await getUserWithPasswordByUsername(username);
    if (!user) {
      return response.status(400).json({
        errors: {
          message:
            'User not found, check your username again or register first',
        },
      });
    }
    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return response
        .status(400)
        .json({ errors: { message: 'Incorrect password' } });
    }
    // create session token, csrf secret and the session cookie
    const sessionToken = crypto.randomBytes(80).toString('base64');
    const csrfSecret = createCsrfSecret();

    const session = await createSession(user.id, sessionToken, csrfSecret);
    const sessionCookie = createSessionCookie(session.token);
    return response
      .status(200)
      .setHeader('Set-Cookie', sessionCookie)
      .json({ user: { username: user.username } });
  }
  return response
    .status(400)
    .json({ errors: { message: 'Wrong request method' } });
}
