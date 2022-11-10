import { css } from '@emotion/react';
import ClearIcon from '@mui/icons-material/Clear';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SaveIcon from '@mui/icons-material/Save';
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
import NotLoggedIn from '../components/NotLoggedIn';
import RecommendedMovies from '../components/RecommendedMovies';
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
// snake_case in release_year because of Python naming convention, where the data comes from
export type Movie = {
  title: string;
  release_year: number;
  // add another variant of releaseYear because of postgreSQL turning it to camelCase
  releaseYear: number;
  cast: string;
  index: number;
};
export type RecommendedMovie = Movie & {
  description: string;
  type: string;
  poster?: string;
  rating: number;
  tmdbId: number;
  media: string;
  director: string;
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

  useEffect(() => {
    const cookie = getCookie('selectedMovie');
    if (cookie) {
      setSelectedMovies(cookie);
    }
  }, []);
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
  async function handleSave() {
    const response = await fetch('api/movies/history', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        movies: recommendedMovies,
        csrfToken: props.csrfToken,
      }),
    });
    const data = await response.json();
    return data;
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
          {/* check if the array recommendedMovies is empty or not */}
          {recommendedMovies.length > 0 ? (
            <RecommendedMovies
              recommendedMovies={recommendedMovies}
              setSelectedMovies={setSelectedMovies}
              setRecommendedMovies={setRecommendedMovies}
              setSearchResult={setSearchResult}
              deleteCookie={deleteCookie}
              handleSave={handleSave}
            />
          ) : // if the array is not empty, check if the page is currently looking for recommendations
          isRecommending ? (
            <Grid item xs={9}>
              <h2>Getting recommendations!</h2>
              <hr />
              <p>This might take up to 30 seconds, please be patient.</p>
              <br />
              <CircularProgress color="inherit" />
            </Grid>
          ) : (
            // if it is not looking for recommendations, show the search field
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
                    data-test-id="search-movie"
                  >
                    Search
                  </Button>
                </FormGroup>
                {/* check if the page is searching in the database */}
                {isSearching ? (
                  <>
                    <p>Currently searching in our database, please hold!</p>
                    <CircularProgress color="inherit" />
                  </>
                ) : (
                  // if not, then display the search results
                  searchResult.length > 0 && (
                    <div className="search">
                      {searchResult.map((movie) => {
                        return (
                          // <li key={`movie_index ${movie.index}`}>
                          <Card
                            key={`movie_index ${movie.index}`}
                            data-test-id={`search-result-movie-${movie.title}`}
                          >
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
                                disabled={
                                  selectedMovies.includes(movie) ||
                                  selectedMovies.length >= 6
                                }
                                startIcon={<PlaylistAddIcon />}
                                data-test-id={`add-search-result-${movie.title}`}
                                onClick={() => {
                                  if (!selectedMovies.includes(movie)) {
                                    handleSelect(movie);
                                    setSelectedMovies([
                                      ...selectedMovies,
                                      movie,
                                    ]);
                                  }
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
                    <div
                      key={`selected movie ${movie.title}`}
                      data-test-id={`selected-movie-${movie.title}`}
                    >
                      <h4>
                        {movie.title} ({movie.release_year})
                        <IconButton
                          onClick={() => handleDelete(movie.title)}
                          aria-label="delete"
                          data-test-id={`delete-selected-movie-${movie.title}`}
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
                  data-test-id="get-recommendations-button"
                >
                  Get recommendations!
                </Button>
              </div>
            </Grid>
          ) : null}
        </Grid>
      ) : (
        <NotLoggedIn />
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
