import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../database/sessions';
import { getUserByToken } from '../../database/user';
import { validateTokenFromCsrfSecret } from '../../utils/csrf';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    // check if the session is valid by retrieving the session token from the cookie
    const session =
      request.cookies.sessionToken &&
      (await getSessionByToken(request.cookies.sessionToken));
    if (!session) {
      return response
        .status(400)
        .json({ errors: { message: 'Session token not valid' } });
    }
    const user = await getUserByToken(session.token);
    if (!user) {
      return response
        .status(400)
        .json({ errors: { message: 'Token did not retrieve valid user' } });
    }

    return response.status(200).json({ user: user });
  }
  return response
    .status(400)
    .json({ errors: { message: 'Wrong request method' } });
}
