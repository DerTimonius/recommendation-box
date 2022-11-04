import { NextApiRequest, NextApiResponse } from 'next';

export type TrendingMovieType = {
  title: string;
  originalTitle: string;
  poster: string;
  overview: string;
  backdrop: string;
  media: string;
  id: number;
};

// snake_case because of the naming of the API response object
type CompleteMovieResponseType =
  | {
      media_type: 'movie';
      title: string;
      original_title: string;
      poster_path: string;
      overview: string;
      backdrop_path: string;
      id: number;
    }
  | {
      id: number;
      backdrop_path: string;
      media_type: 'tv';
      name: string;
      original_name: string;
      poster_path: string;
      overview: string;
    }
  | { media_type: 'person' };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}`,
    );
    const data = await res.json();
    // was the fetching successful? (data.success only exists in API response on failed queries)
    if (!data.success) {
      const resultArray: TrendingMovieType[] = data.results
        .slice(0, 10)
        .map((result: CompleteMovieResponseType) => {
          if (result.media_type === 'movie') {
            return {
              title: result.title,
              originalTitle: result.original_title,
              poster: result.poster_path,
              overview: result.overview,
              backdrop: result.backdrop_path,
              media: result.media_type,
              id: result.id,
            };
          } else if (result.media_type === 'tv') {
            return {
              id: result.id,
              media: result.media_type,
              backdrop: result.backdrop_path,
              title: result.name,
              originalTitle: result.original_name,
              poster: result.poster_path,
              overview: result.overview,
            };
          }
          return null;
        });
      return response.status(200).json({ result: resultArray });
    }
    return response
      .status(400)
      .json({ errors: { message: "API fetch didn't work" } });
  }
  return response
    .status(400)
    .json({ errors: { message: 'Only GET method allowed here!' } });
}
