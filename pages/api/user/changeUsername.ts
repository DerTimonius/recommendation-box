import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../../database/sessions';
import {
  getUserByToken,
  getUserWithPasswordByUsername,
  updateUsernameById,
} from '../../../database/user';
import { validateTokenFromCsrfSecret } from '../../../utils/csrf';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'PUT') {
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
  // get the password from the request
  const password = request.body.password;
  if (!password || typeof password !== 'string') {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid password input' } });
  }
  // check if old password is correct
  const isPasswordValid = await bcrypt.compare(password, fullUser.passwordHash);
  if (!isPasswordValid) {
    return response
      .status(400)
      .json({ errors: { message: 'Incorrect password' } });
  }
  // get the username from the request
  const newUsername = request.body.newUsername;
  if (!newUsername || typeof newUsername !== 'string') {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid username input' } });
  }
  // call the database to update the username
  const newUserInfo = await updateUsernameById(fullUser.id, newUsername);
  if (!newUserInfo) {
    return response
      .status(400)
      .json({ errors: { message: 'user could not be updated' } });
  }
  return response.status(200).json({ user: newUserInfo });
}
