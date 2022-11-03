import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../database/sessions';
import { changePreferenceById, getUserByToken } from '../../database/user';
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
  // check if preferences are sent via the request body
  const preferences = request.body.preferences;
  if (typeof preferences !== 'boolean') {
    return response.status(400).json({
      errors: {
        message: 'bad request, preferences need to be sent in the request',
      },
    });
  }
  // update user
  const updatedUser = await changePreferenceById(user.id, preferences);
  if (!updatedUser) {
    return response
      .status(400)
      .json({ errors: { message: 'user could not be updated' } });
  }
  return response.status(200).json({ user: updatedUser });
}
