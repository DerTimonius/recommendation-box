import DoneIcon from '@mui/icons-material/Done';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
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
  saveSuccessful: boolean;
};
export default function RecommendedMovies({
  recommendedMovies,
  setRecommendedMovies,
  setSelectedMovies,
  setSearchResult,
  deleteCookie,
  handleSave,
  saveSuccessful,
}: Props) {
  return (
    <Grid item xs={10} lg={9}>
      <Typography variant="h3">Your tailor-made recommendations</Typography>
      <div>
        {recommendedMovies.map((movie) => {
          return (
            <Card
              key={`recommended movie ${movie.title}`}
              data-test-id={`recommended-movie-${movie.title}`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '8px',
                marginRight: '10px',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="h5">
                        {movie.title} ({movie.release_year})
                      </Typography>
                      {movie.poster ? (
                        <img
                          src={`https://image.tmdb.org/t/p/original${movie.poster}`}
                          height={400}
                          width={300}
                          alt={`Poster of ${movie.title}`}
                        />
                      ) : (
                        <Typography variant="caption">
                          No poster found
                        </Typography>
                      )}{' '}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '50px 12px 25px 36px',
                        maxWidth: '480px',
                      }}
                    >
                      <Typography variant="body1">Cast: </Typography>
                      <Typography variant="body2">{movie.cast}</Typography>
                      {movie.director !== 'nan' && (
                        <>
                          <Typography variant="body1">Director: </Typography>
                          <Typography variant="body2">
                            {movie.director}
                          </Typography>
                        </>
                      )}
                      {movie.rating ? (
                        <Typography variant="subtitle1">
                          IMDb Rating: {movie.rating.toFixed(1)}
                        </Typography>
                      ) : null}
                      {movie.tmdbId ? (
                        <MUILink
                          href={`https://www.themoviedb.org/${movie.media}/${movie.tmdbId}`}
                          target="_blank"
                          rel="noreferrer"
                          underline="hover"
                          color="primary"
                        >
                          Learn more at TMDb!
                        </MUILink>
                      ) : null}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">Plot Summary</Typography>
                    <Typography variant="body1">{movie.description}</Typography>
                  </Box>
                </Box>
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
        color="secondary"
        data-test-id="new-recommendations-button"
      >
        Get new recommendations!
      </Button>
      <Button
        variant="contained"
        startIcon={saveSuccessful ? <DoneIcon /> : <SaveIcon />}
        onClick={handleSave}
        data-test-id="save-recommendations-button"
        color="primary"
      >
        {saveSuccessful ? <>Saved</> : <>Save to history!</>}
      </Button>
    </Grid>
  );
}
