import LiveTvIcon from '@mui/icons-material/LiveTv';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MUILink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { Movie, RecommendedMovie } from '../pages/movies';

type Props = {
  recommendedMovies: RecommendedMovie[];
  setRecommendedMovies: (movies: RecommendedMovie[]) => void;
  setSelectedMovies: (movies: Movie[]) => void;
  setSearchResult: (movies: Movie[]) => void;
  deleteCookie: (key: string) => void;
  handleSave: () => Promise<any>;
};
export default function RecommendedMovies({
  recommendedMovies,
  setRecommendedMovies,
  setSelectedMovies,
  setSearchResult,
  deleteCookie,
  handleSave,
}: Props) {
  return (
    <Grid item xs={9}>
      <h2>Your recommendations</h2>
      <div>
        {recommendedMovies.map((movie) => {
          return (
            <Card
              key={`recommended movie ${movie.title}`}
              data-test-id={`recommended-movie-${movie.title}`}
            >
              <CardContent>
                <Typography variant="h5">
                  {movie.title} ({movie.release_year})
                </Typography>
                {movie.poster ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${movie.poster}`}
                    height={300}
                    width={220}
                    alt={`Poster of ${movie.title}`}
                  />
                ) : (
                  <p>No poster found</p>
                )}
                <Typography variant="body1">{movie.cast}</Typography>
                <Typography variant="body2">{movie.description}</Typography>
                {movie.rating ? (
                  <Typography variant="body2">
                    IMDb Rating: {movie.rating}
                  </Typography>
                ) : null}
                {movie.tmdbId ? (
                  <MUILink
                    href={`https://www.themoviedb.org/${movie.media}/${movie.tmdbId}`}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                  >
                    Learn more at TMDb!
                  </MUILink>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Button
        variant="contained"
        onClick={() => {
          setRecommendedMovies([]);
          setSelectedMovies([]);
          setSearchResult([]);
          deleteCookie('selectedMovie');
        }}
        startIcon={<LiveTvIcon />}
        data-test-id="new-recommendations-button"
      >
        Get new recommendations!
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSave}
        data-test-id="save-recommendations-button"
      >
        Save to history!
      </Button>
    </Grid>
  );
}
