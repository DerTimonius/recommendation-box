import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../../database/sessions';
import { validateTokenFromCsrfSecret } from '../../../utils/csrf';
import { searchFromDjango } from '../../../utils/getFromDjango';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(400).json({
      errors: {
        message: 'Invalid request method, only post allowed',
      },
    });
  }
  // check if it is a valid session
  const session =
    request.cookies.sessionToken &&
    (await getSessionByToken(request.cookies.sessionToken));
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
  const searchItem = request.body.searchItem;
  // get the data by connecting to external Django API
  const data = await searchFromDjango(searchItem);
  return response.status(200).json({ result: data });
}
