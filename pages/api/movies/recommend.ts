import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../../database/sessions';
import { getUserByToken } from '../../../database/user';
import { checkRecommendations } from '../../../utils/connect_to_python';
import { validateTokenFromCsrfSecret } from '../../../utils/csrf';
import getMovieDetails from '../../../utils/details';
import { recommendFromDjango } from '../../../utils/getFromDjango';
import { RecommendedMovie } from '../../movies';

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
  const selectedMovies: number[] = request.body.selectedMovies;
  const options = request.body.options;
  if (
    selectedMovies.length === 0 ||
    !options ||
    !Array.isArray(selectedMovies) ||
    typeof options !== 'string'
  ) {
    return response.status(400).json({
      errors: { message: 'Movie List and/or Options missing or wrong type' },
    });
  }
  const numberOfMovies: number = request.body.wantedNumber;
  if (!numberOfMovies) {
    return response.status(400).json({
      errors: { message: 'Wanted number of recommendations missing' },
    });
  }

  // if you want to use this application locally, comment out the following lines of code and remove lines 77-82
  /* const dataFromAPI: RecommendedMovie[] | undefined = JSON.parse(
    await checkRecommendations(
      selectedMovies.join(' '),
      options,
      user.preferences,
      numberOfMovies,
    ),
  ); */

  // get the data by connecting to external Django API
  const dataFromAPI: RecommendedMovie[] | undefined = await recommendFromDjango(
    selectedMovies,
    options,
    user.preferences,
    numberOfMovies,
  );
  if (!dataFromAPI) {
    return response
      .status(503)
      .json({ errors: { message: 'Django did not respond well' } });
  }
  // add further details to be displayed later
  const resultArray = await Promise.all(
    dataFromAPI.map(async (movie) => {
      const data = await getMovieDetails(movie.title, movie.release_year);
      if (data) {
        return {
          ...movie,
          poster: data[0].poster_path,
          rating: data[0].vote_average,
          tmdbId: data[0].id,
          media: data[0].media_type,
        };
      } else {
        return { ...movie };
      }
    }),
  );
  return response.status(200).json({ result: resultArray });
}
