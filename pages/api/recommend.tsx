import { NextApiRequest, NextApiResponse } from 'next';
import { checkRecommendations } from '../../utils/connect_to_python';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response
      .status(400)
      .json({ errors: { message: 'Wrong request method!' } });
  }
  const selectedMovies = request.body.selectedMovies;
  const result = JSON.parse(await checkRecommendations(selectedMovies));
  return response.status(200).json({ result: result });
}
