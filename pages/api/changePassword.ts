import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../database/sessions';
import {
  getUserByToken,
  getUserWithPasswordByUsername,
  updatePasswordById,
} from '../../database/user';
import { validateTokenFromCsrfSecret } from '../../utils/csrf';

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

  // check if both passwords were sent in the request
  const oldPassword = request.body.password;
  const newPassword = request.body.newPassword;
  if (
    !oldPassword ||
    !newPassword ||
    typeof newPassword !== 'string' ||
    typeof oldPassword !== 'string'
  ) {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid password input' } });
  }
  // check if old password is correct
  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    fullUser.passwordHash,
  );
  if (!isPasswordValid) {
    return response
      .status(400)
      .json({ errors: { message: 'Incorrect password' } });
  }
  // create a new password hash
  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  const updatedUser = await updatePasswordById(fullUser.id, newPasswordHash);
  if (!updatedUser) {
    return response
      .status(400)
      .json({ errors: { message: 'user could not be updated' } });
  }
  return response.status(200).json({ user: updatedUser });
}
