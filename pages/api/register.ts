import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { createUser, getUserByUsername, User } from '../../database/user';
import { cretaeSessionCookie } from '../../utils/cookie';
import { createCsrfSecret } from '../../utils/csrf';

export type Error = {
  message: string;
};
export type RegisterResponseType =
  | { errors: Error }
  | { user: { username: User['username'] } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // check if correct request method
  if (request.method !== 'POST') {
    return response.status(405).json({
      errors: { message: 'Wrong request method, only POST possible.' },
    });
  }
  // is the input correct?
  if (
    !request.body.password ||
    !request.body.username ||
    typeof request.body.username !== 'string' ||
    typeof request.body.password !== 'string'
  ) {
    return response.status(401).json({
      errors: { message: 'Either username or password were not provied!' },
    });
  }
  // does a user with the same username already exist?
  const existingUser = await getUserByUsername(request.body.username);
  if (existingUser) {
    return response
      .status(401)
      .json({ errors: { message: 'Sorry, this username is already taken.' } });
  }
  const username = request.body.username;
  // hash the password so not to save the password as plain text on the database
  const passwordHash = await bcrypt.hash(request.body.password, 12);
  const newUser = await createUser(username, passwordHash);
  // if the user was created correctly, create session token with a cookie and csrf secret for a) keeping the user logged in and b) additional security
  if (newUser) {
    const sessionToken = crypto.randomBytes(80).toString('base64');
    const csrfSecret = createCsrfSecret();

    const session = await createSession(newUser.id, sessionToken, csrfSecret);
    const sessionCookie = cretaeSessionCookie(session.token);
    return response
      .status(200)
      .setHeader('Set-Cookie', sessionCookie)
      .json({ user: { username: newUser.username } });
  }
}
