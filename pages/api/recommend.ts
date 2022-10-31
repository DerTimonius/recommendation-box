import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../database/sessions';
import { getUserByToken } from '../../database/user';
import { checkRecommendations } from '../../utils/connect_to_python';
import { validateTokenFromCsrfSecret } from '../../utils/csrf';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response
      .status(400)
      .json({ errors: { message: 'Wrong request method!' } });
  }
  // get user by session token to get the preferences
  const token = request.cookies.sessionToken;
  if (!token) {
    return response
      .status(400)
      .json({ errors: { message: 'No token passed' } });
  }
  const session = await getSessionByToken(token);
  if (!session) {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid token passed' } });
  }
  const user = await getUserByToken(token);
  if (!user) {
    return response
      .status(401)
      .json({ errors: { message: 'Invalid token passed, user not found' } });
  }
  // check if the csrf token is correct
  const csrfSecret = session.csrfToken;
  const csrfToken = request.body.csrfToken;
  if (!validateTokenFromCsrfSecret(csrfSecret, csrfToken)) {
    return response
      .status(401)
      .json({ errors: { message: 'Invalid CSRF token, you hacker!' } });
  }
  // get the selected movies from the request body
  const selectedMovies = request.body.selectedMovies;
  const result = JSON.parse(
    await checkRecommendations(selectedMovies, user.preferences),
  );
  return response.status(200).json({ result: result });
}
