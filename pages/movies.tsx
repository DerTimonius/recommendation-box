import { css } from '@emotion/react';
import ClearIcon from '@mui/icons-material/Clear';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MUILink from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSessionByToken } from '../database/sessions';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { createTokenFromSecret } from '../utils/csrf';

const movieStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
  .search-results {
    margin: 12px;
    padding: 24px;
  }
  li {
    padding: 24px;
    list-style-type: none;
    border: 1px solid #b9e25e;
    border-radius: 16px;
  }
  ul > li + li {
    margin-top: 36px;
  }
`;

const selectedStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  padding-top: 48px;
  height: 100vh;
`;

export type Movie = {
  title: string;
  release_year: number;
  cast: string;
  index: number;
};
export type RecommendedMovie = Movie & {
  description: string;
  type: string;
  poster: string | undefined;
  rating: number;
  tmdbId: number;
  media: string;
};

type Props =
  | { errors: { message: string }[]; csrfToken: undefined }
  | { csrfToken: string };
export default function Movies(props: Props) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<
    RecommendedMovie[]
  >([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [options, setOptions] = useState('both');

  /*  useEffect(() => {
    const cookie = getCookie('selectedMovie');
    setSelectedMovies([]);
    console.log(cookie);
    if (cookie) {
      setSelectedMovies([...selectedMovies, cookie[0]]);
      console.log(selectedMovies);
    }
  }, []); */
  async function handleSearch() {
    setSearchResult([]);
    setIsSearching(true);
    const response = await fetch('/api/movies/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        searchItem: searchInput,
        csrfToken: props.csrfToken,
      }),
    });
    const data = await response.json();
    setSearchResult(data.result);
    setIsSearching(false);
    setSearchInput('');
  }
  async function handleRecommendations() {
    setRecommendedMovies([]);
    setIsRecommending(true);
    const selectedMoviesIndex = selectedMovies.map((movie) => movie.index);
    const response = await fetch('/api/movies/recommend', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        selectedMovies: selectedMoviesIndex.join(' '),
        csrfToken: props.csrfToken,
        options: options,
      }),
    });
    const data = await response.json();
    setRecommendedMovies(data.result);
    setIsRecommending(false);
  }
  function handleDelete(title: Movie['title']) {
    const movieList = selectedMovies;
    setSelectedMovies(movieList.filter((movie) => movie.title !== title));
  }
  function handleSelect(movie: Movie) {
    const cookieValue = getCookie('selectedMovie');
    if (!cookieValue) {
      setCookie('selectedMovie', [movie]);
    } else {
      cookieValue.push(movie);
      setCookie('selectedMovie', cookieValue);
    }
  }
  return (
    <>
      <Head>
        <title>Discover new movies</title>
        <meta
          name="description"
          content="Get movie recommendations based on your inputs"
        />
      </Head>
      {!('errors' in props) ? (
        <Grid container>
          {recommendedMovies.length > 0 ? (
            <Grid item xs={9}>
              <h2>Your recommendations</h2>
              <div>
                {recommendedMovies.map((movie) => {
                  return (
                    <Card key={`recommended movie ${movie.title}`}>
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
                        <Typography variant="body2">
                          {movie.description}
                        </Typography>
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
              >
                Get new recommendations!
              </Button>
            </Grid>
          ) : isRecommending ? (
            <Grid item xs={9}>
              <h2>Getting recommendations!</h2>
              <hr />
              <p>This might take up to 30 seconds, please be patient.</p>
              <br />
              <CircularProgress color="inherit" />
            </Grid>
          ) : (
            <Grid item xs={9}>
              <div css={movieStyles}>
                <Typography variant="h3">
                  Discover new entertainment options
                </Typography>
                <br />
                <FormGroup sx={{ width: 480 }}>
                  <TextField
                    id="search-field"
                    fullWidth={true}
                    variant="outlined"
                    label="Search Movie/TV show"
                    value={searchInput}
                    disabled={selectedMovies.length >= 6}
                    onChange={(event) =>
                      setSearchInput(event.currentTarget.value)
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                </FormGroup>

                {isSearching ? (
                  <>
                    <p>Currently searching in our database, please hold!</p>
                    <CircularProgress color="inherit" />
                  </>
                ) : (
                  searchResult.length > 0 && (
                    <div className="search-resdivts">
                      {searchResult.map((movie) => {
                        return (
                          // <li key={`movie_index ${movie.index}`}>
                          <Card key={`movie_index ${movie.index}`}>
                            <CardContent>
                              <Typography variant="h6">
                                {movie.title} ({movie.release_year})
                              </Typography>
                              <Typography variant="body1">
                                {' '}
                                Cast: {movie.cast}
                              </Typography>
                              <Button
                                variant="contained"
                                startIcon={<PlaylistAddIcon />}
                                onClick={() => {
                                  handleSelect(movie);
                                  setSelectedMovies([...selectedMovies, movie]);
                                }}
                              >
                                Add to selected movies
                              </Button>
                            </CardContent>
                          </Card>
                          // </li>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </Grid>
          )}
          {selectedMovies.length > 0 ? (
            <Grid item xs={3} sx={{ maxWidth: 240 }}>
              <div css={selectedStyles}>
                <h3>Selected movies:</h3>
                {selectedMovies.map((movie) => {
                  return (
                    <div key={`selected movie ${movie.title}`}>
                      <h4>
                        {movie.title} ({movie.release_year})
                        <IconButton
                          onClick={() => handleDelete(movie.title)}
                          aria-label="delete"
                        >
                          <ClearIcon />
                        </IconButton>
                      </h4>
                    </div>
                  );
                })}
                <FormControl>
                  <FormLabel id="radio-options">Select type:</FormLabel>
                  <RadioGroup
                    aria-label="radio-options"
                    name="radio-options-group"
                    value={options}
                    onChange={(event) => setOptions(event.target.value)}
                  >
                    <FormControlLabel
                      value="movie"
                      label="Movie"
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="tv"
                      label="TV Show"
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="both"
                      label="Both"
                      control={<Radio />}
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  onClick={handleRecommendations}
                  variant="outlined"
                  startIcon={<LiveTvIcon />}
                >
                  Get recommendations!
                </Button>
              </div>
            </Grid>
          ) : null}
        </Grid>
      ) : (
        <div>
          <h3>
            Do you also want to get recommendations based on multiple movies?
          </h3>
          <p>
            <Link href="/login">Log in to your account</Link> or{' '}
            <Link href="registration">create a free account</Link> to get going!
          </p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const session = token && (await getSessionByToken(token));
  if (!session) {
    context.res.statusCode = 401;
    return {
      props: {
        errors: [{ message: 'Unauthorized user' }],
      },
    };
  }
  const csrfToken = createTokenFromSecret(session.csrfToken);
  return { props: { csrfToken: csrfToken } };
}
