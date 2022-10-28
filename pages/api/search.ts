import { NextApiRequest, NextApiResponse } from 'next';
import { checkSearch } from '../../utils/connect_to_python';

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
  const searchItem = request.body.searchItem;
  const result = JSON.parse(await checkSearch(searchItem));
  return response.status(200).json({ result: result });
}
