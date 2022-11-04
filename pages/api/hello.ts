import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return response
    .status(200)
    .json({ message: 'Nothing to see here, please disperse!' });
}
