import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../database/sessions';
import {
  deleteUserById,
  getUserByToken,
  getUserWithPasswordByUsername,
} from '../../database/user';
import { validateTokenFromCsrfSecret } from '../../utils/csrf';

export default async function hanlder(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'DELETE') {
    return response
      .status(400)
      .json({ errors: { message: 'Wrong request method' } });
  }
  const token = request.cookies.sessionToken;
  // check if it is a valid session
  const session = token && (await getSessionByToken(token));
  if (!session) {
    return response
      .status(401)
      .json({ errors: { message: 'Invalid session token passed!' } });
  }
  // validate the csrfToken
  const csrfSecret = session.csrfToken;
  const csrfToken = request.body.csrfToken;
  if (!validateTokenFromCsrfSecret(csrfSecret, csrfToken)) {
    return response
      .status(401)
      .json({ errors: { message: 'Invalid CSRF token, you hacker!' } });
  }
  // get the user from the database
  const user = token && (await getUserByToken(token));
  if (!user) {
    return response
      .status(401)
      .json({ errors: { message: 'Unauthorized, login necessary' } });
  }
  // get full user info
  const fullUser = await getUserWithPasswordByUsername(user.username);
  if (!fullUser) {
    return response.status(400).json({ errors: { message: 'user not found' } });
  }
  // compare entered password with password hash
  const password = request.body.password;
  if (!password || typeof password !== 'string') {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid password input' } });
  }
  const isPasswordValid = await bcrypt.compare(password, fullUser.passwordHash);
  if (!isPasswordValid) {
    return response
      .status(400)
      .json({ errors: { message: 'Incorrect password' } });
  }
  const deletedUser = await deleteUserById(user.id);
  return response
    .status(200)
    .setHeader(
      'Set-Cookie',
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    )
    .json({ user: deletedUser });
}
