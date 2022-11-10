import { RecommendedMovie } from '../pages/movies';
import { sql } from './connect';
import { User } from './user';

export type SavedRecommendedMovie = RecommendedMovie & {
  id: number;
};
export async function getMovieById(id: number) {
  const [movie] = await sql<RecommendedMovie[]>`
  SELECT * FROM
    recommended_movie
  WHERE
    id = ${id}
  `;
  return movie;
}

export async function getMoviesByUserId(id: User['id']) {
  const movies = await sql<SavedRecommendedMovie[]>`
  SELECT
    recommended_movie.title,
    recommended_movie.release_year,
    recommended_movie.director,
    recommended_movie.movie_data_id,
    recommended_movie.description,
    recommended_movie.type,
    recommended_movie.poster,
    recommended_movie.rating,
    recommended_movie.tmdb_id,
    recommended_movie.media
  FROM
    recommended_movie,
    recommendation_history
  WHERE
    recommendation_history.user_id = ${id} AND
    recommendation_history.movie_id = recommended_movie.id
  `;
  return movies;
}

export async function getMovieByTitleAndYear(
  title: RecommendedMovie['title'],
  year: RecommendedMovie['release_year'],
) {
  const [movie] = await sql<SavedRecommendedMovie[]>`
  SELECT * FROM
    recommended_movie
  WHERE
    title = ${title} AND
    release_year = ${year}
  `;
  return movie;
}

export async function addToHistory(
  userId: User['id'],
  movies: RecommendedMovie[],
) {
  if (!userId || movies.length === 0) return undefined;
  const addedMovies = [];
  for (const movie of movies) {
    // check if movie is already in database
    const alreadyInDatabase = await getMovieByTitleAndYear(
      movie.title,
      movie.release_year,
    );
    if (alreadyInDatabase) {
      addedMovies.push(alreadyInDatabase);
      continue;
    }
    if (movie.poster) {
      const [addedMovie] = await sql<SavedRecommendedMovie[]>`
    INSERT INTO recommended_movie
      (title, release_year, director, description, type, poster, rating, tmdb_id, media)
    VALUES
      (${movie.title}, ${movie.release_year}, ${movie.director}, ${movie.description}, ${movie.type}, ${movie.poster}, ${movie.rating}, ${movie.tmdbId}, ${movie.media})
    RETURNING *
    `;
      addedMovies.push(addedMovie);
    } else {
      const [partiallyKnownMovie] = await sql<SavedRecommendedMovie[]>`
      INSERT INTO recommended_movie
      (title, release_year, director, description, typeof)
    VALUES
      (${movie.title}, ${movie.release_year}, ${movie.director}, ${movie.description}, ${movie.type})
    RETURNING *`;
      addedMovies.push(partiallyKnownMovie);
    }
  }
  const moviesInHistory = [];
  for (const movie of addedMovies) {
    if (movie) {
      const [addedToHistory] = await sql`
    INSERT INTO recommendation_history
      (movie_id, user_id)
    VALUES
      (${movie.id}, ${userId})
    RETURNING *`;
      moviesInHistory.push(addedToHistory);
    }
    continue;
  }
  return addedMovies;
}

export async function deleteMovieById(
  movieId: SavedRecommendedMovie['id'],
  userId: User['id'],
) {
  const [movie] = await sql`
  DELETE FROM
    recommendation_history
  WHERE
    movie_id = ${movieId} AND
    user_id = ${userId}
  RETURNING *
  `;
  return movie;
}
