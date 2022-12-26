import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../../database/sessions';
import { checkSearch } from '../../../utils/connect_to_python';
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

  // if you want to use this application locally, comment out the following line of code and remove line 41
  // const data = JSON.parse(await checkSearch(searchItem));

  // get the data by connecting to external Django API
  const data = await searchFromDjango(searchItem);
  if (!data) {
    return response
      .status(503)
      .json({ errors: { message: 'Django did not respond well' } });
  }
  return response.status(200).json({ result: data });
}
