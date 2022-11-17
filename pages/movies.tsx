import { css } from '@emotion/react';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
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
  const [wantedNumberOfMovies, setWantedNumberOfMovies] = useState<number>(3);

  if (!props.csrfToken) {
    deleteCookie('selectedMovie');
  }
  useEffect(() => {
    const cookie = getCookie('selectedMovie');
    if (cookie) {
      setSelectedMovies(cookie);
    }
  }, []);
  async function handleSearch(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    setSearchResult([]);
    setIsSearching(true);
    const response = await fetch('/api/movies/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        csrfToken: props.csrfToken,
        searchItem: searchInput,
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
        wantedNumber: wantedNumberOfMovies,
      }),
    });
    const data = await response.json();
    setRecommendedMovies(data.result);
    setIsRecommending(false);
  }
  function handleDelete(title: Movie['title']) {
    const movieList = selectedMovies;
    setSelectedMovies(movieList.filter((movie) => movie.title !== title));
    const listInCookie: Movie[] = getCookie('selectedMovie');
    const newCookieValue = listInCookie.filter(
      (movie) => movie.title !== title,
    );
    setCookie('selectedMovie', newCookieValue);
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

      {/* check if the user is logged in or not */}
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
              <Typography variant="h2">Getting recommendations!</Typography>
              <hr />
              <Typography variant="body1">
                This might take up to 30 seconds, please be patient.
              </Typography>
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
                <FormGroup
                  sx={{
                    width: 480,
                    marginBottom: '12px',
                    '@media (max-width: 720px)': {
                      width: 200,
                    },
                  }}
                >
                  <form onSubmit={handleSearch}>
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
                      type="submit"
                      sx={{
                        width: 480,
                        '@media (max-width: 720px)': {
                          width: 200,
                        },
                      }}
                      disabled={selectedMovies.length >= 6}
                    >
                      Search
                    </Button>
                  </form>
                </FormGroup>
                {/* check if the page is searching in the database */}
                {isSearching ? (
                  <>
                    <Typography variant="body1">
                      Currently searching in our database, please hold!
                    </Typography>
                    <CircularProgress color="inherit" />
                  </>
                ) : (
                  // if not, then display the search results
                  searchResult.length > 0 && (
                    <Box>
                      {searchResult.map((movie) => {
                        return (
                          <Card
                            key={`movie_index ${movie.index}`}
                            data-test-id={`search-result-movie-${movie.title}`}
                            sx={{marginBottom: 0.5}}
                          >
                            <CardContent>
                              <Typography variant="h6">
                                {movie.title} ({movie.release_year})
                              </Typography>

                              {movie.cast !== 'nan...' ? (
                                <Typography variant="body1">
                                  {' '}
                                  Cast: {movie.cast}
                                </Typography>
                              ) : null}
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
                        );
                      })}
                    </Box>
                  )
                )}
              </div>
            </Grid>
          )}
          {/* show the sidebar on the left only if a movie has already been selected d*/}
          {selectedMovies.length > 0 ? (
            <Grid
              item
              xs={3}
              sx={{
                maxWidth: 240,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  height: 'max-content',
                  marginTop: '34px',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2,
                  paddingTop: 6,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 4 }}>
                  Selected movies:
                </Typography>
                {selectedMovies.map((movie) => {
                  return (
                    <Box
                      key={`selected movie ${movie.title}`}
                      sx={{ paddingTop: '8px' }}
                    >
                      <Box data-test-id={`selected-movie-${movie.title}`}>
                        <Typography variant="h6">
                          {movie.title} ({movie.release_year})
                          <IconButton
                            onClick={() => handleDelete(movie.title)}
                            aria-label="delete"
                            color="warning"
                            data-test-id={`delete-selected-movie-${movie.title}`}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Typography>
                      </Box>
                      <Divider />
                    </Box>
                  );
                })}
                <FormControl sx={{ marginTop: '24px' }}>
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
                <FormControl>
                  <FormLabel id="wanted-number-movies">
                    How many recommendations do you want?
                  </FormLabel>
                  <TextField
                    type="number"
                    value={wantedNumberOfMovies}
                    onChange={(event) => {
                      if (
                        Number(event.target.value) > 0 &&
                        Number(event.target.value) <= 10
                      ) {
                        setWantedNumberOfMovies(Number(event.target.value));
                      }
                    }}
                  />
                </FormControl>
                <Button
                  onClick={handleRecommendations}
                  variant="contained"
                  startIcon={<LiveTvIcon />}
                  data-test-id="get-recommendations-button"
                  sx={{ marginTop: 1 }}
                >
                  Get recommendations!
                </Button>
              </Box>
            </Grid>
          ) : null}
          <Accordion
            sx={{
              marginTop:
                selectedMovies.length > 0 && searchResult.length > 0 ? 3 : 36,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="accordion-panel"
            >
              <Typography variant="h5">Disclaimer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1">
                This application is built with a dataset of around 19.000 movies
                and TV shows, collected from the american Netflix and Amazon
                Prime listing. The set was up to date until September 2021, so
                anything after will not be part of this dataset.
              </Typography>
              <Typography variant="subtitle1">
                Another thing: As of today the search bar does not yet feature
                autocomplete and it will always show stuff, even if it's not
                remotely similar to the move you entered. If what you're looking
                for is not in the search results, it's sadly not in the dataset
                yet.
              </Typography>
            </AccordionDetails>
          </Accordion>
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
