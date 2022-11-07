import { NextApiRequest, NextApiResponse } from 'next';
import {
  addToHistory,
  deleteMovieById,
  getMovieByTitleAndYear,
  getMoviesByUserId,
} from '../../../database/recommendedMovies';
import { getSessionByToken } from '../../../database/sessions';
import { getUserByToken } from '../../../database/user';
import { validateTokenFromCsrfSecret } from '../../../utils/csrf';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // check if user is logged in
  const token = request.cookies.sessionToken;
  if (!token) {
    return response.status(400).json({
      errors: { message: 'No session token passed, please log in first' },
    });
  }
  const session = await getSessionByToken(token);
  if (!session) {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid token passed' } });
  }
  // get user information
  const user = await getUserByToken(token);
  if (!user) {
    return response.status(400).json({ errors: { message: 'No user found' } });
  }
  // check the possible, valid request methods (GET, POST, DELETE)
  if (request.method === 'GET') {
    // retrieve the history by the user id
    const movieHistory = await getMoviesByUserId(user.id);
    // pass it on even if it is empty, as it will be checked on the frontend
    return response.status(200).json({ history: movieHistory });
  } else if (request.method === 'POST') {
    // check if the csrf token is correct
    const csrfSecret = session.csrfToken;
    const csrfToken = request.body.csrfToken;
    if (!validateTokenFromCsrfSecret(csrfSecret, csrfToken)) {
      return response
        .status(401)
        .json({ errors: { message: 'Invalid CSRF token, you hacker!' } });
    }

    // check if movies have been sent in the request
    const movies = request.body.movies;
    if (!movies) {
      return response
        .status(400)
        .json({ errors: { message: 'No movies provided' } });
    }
    const addedMovies = await addToHistory(user.id, movies);
    return response.status(200).json({ result: addedMovies });
  } else if (request.method === 'DELETE') {
    // check if the csrf token is correct
    const csrfSecret = session.csrfToken;
    const csrfToken = request.body.csrfToken;
    if (!validateTokenFromCsrfSecret(csrfSecret, csrfToken)) {
      return response
        .status(401)
        .json({ errors: { message: 'Invalid CSRF token, you hacker!' } });
    }
    // check if the movie in the request is valid and in database
    const movieTitle = request.body.title;
    const movieYear = request.body.year;
    if (!movieTitle || !movieYear) {
      return response
        .status(400)
        .json({ errors: { message: 'Movie title and/or year missing' } });
    }
    const movie = await getMovieByTitleAndYear(movieTitle, movieYear);
    if (!movie) {
      return response
        .status(400)
        .json({ errors: { message: 'Movie not found' } });
    }
    const deleted = await deleteMovieById(movie.id, user.id);
    return response.status(200).json({ deleteData: deleted });
  } else {
    return response
      .status(400)
      .json({ errors: { message: 'Invalid request method!' } });
  }
}
