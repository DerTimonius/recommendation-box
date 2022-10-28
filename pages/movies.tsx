import { css } from '@emotion/react';
import { CircularProgress, Grid } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';

const movieStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;

  #search-field {
    background-color: #b9e25e;
    color: black;
    border-radius: 6px;
    height: 24px;
  }
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
  .loading-recommendations {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const selectedStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  padding-top: 48px;
  border-left: 1px solid #b9e25e;
  height: 100vh;
`;

export type Movie = {
  title: string;
  release_year: number;
  cast: string;
  index: number;
};
export type RecommendedMovie = Movie & { description: string; type: string };
function Movies() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<
    RecommendedMovie[]
  >([]);
  const [isRecommending, setIsRecommending] = useState(false);

  async function handleSearch() {
    setSearchResult([]);
    setSearchInput('');
    setIsSearching(true);
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ searchItem: searchInput }),
    });
    const data = await response.json();
    setSearchResult(data.result);
    setIsSearching(false);
  }
  async function handleRecommendations() {
    setRecommendedMovies([]);
    setIsRecommending(true);
    const selectedMoviesIndex = selectedMovies.map((movie) => movie.index);
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ selectedMovies: selectedMoviesIndex.join(' ') }),
    });
    const data = await response.json();
    setRecommendedMovies(data.result);
    setIsRecommending(false);
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
      <Grid container>
        {recommendedMovies.length > 0 ? (
          <Grid item xs={9}>
            <h2>Your recommendations</h2>
            <div>
              {recommendedMovies.map((movie) => {
                return (
                  <div key={`recommended movie ${movie.title}`}>
                    <h4>
                      {movie.title} ({movie.release_year})
                    </h4>
                    <p>{movie.cast}</p>
                    <p>{movie.description}</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setRecommendedMovies([]);
                setSelectedMovies([]);
                setSearchResult([]);
              }}
            >
              Get new recommendations!
            </button>
          </Grid>
        ) : isRecommending ? (
          <div className="loading-recommendations">
            <h2>Getting recommendations!</h2>
            <hr />
            <p>This might take up to 30 seconds, please be patient.</p>
            <br />
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <Grid item xs={9}>
            <div css={movieStyles}>
              <h1>Discover new entertainment options</h1>
              <br />
              <div>
                <input
                  // label="Search movie/show"
                  id="search-field"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.currentTarget.value)
                  }
                />
                <button onClick={handleSearch}>Search</button>
              </div>
              {isSearching ? (
                <>
                  <p>Currently searching in our database, please hold!</p>
                  <CircularProgress color="inherit" />
                </>
              ) : null}
              {searchResult.length > 0 ? (
                <ul className="search-results">
                  {searchResult.map((movie) => {
                    return (
                      <li key={`movie_index ${movie.index}`}>
                        <div>
                          <h4>
                            {movie.title} ({movie.release_year})
                          </h4>
                          <p>{movie.cast}</p>
                        </div>
                        <button
                          onClick={() =>
                            setSelectedMovies([...selectedMovies, movie])
                          }
                        >
                          Add to selected movies
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {/* {searchResult ? searchResult.map((movie) => {}) : null} */}
            </div>
          </Grid>
        )}
        {selectedMovies.length > 0 ? (
          <Grid item xs={3}>
            <div css={selectedStyles}>
              <h3>Selected movies:</h3>
              {selectedMovies.map((movie) => {
                return (
                  <div key={`selected movie ${movie.title}`}>
                    <h4>
                      {movie.title} ({movie.release_year})
                    </h4>
                  </div>
                );
              })}
              <button onClick={handleRecommendations}>
                Get recommendations!
              </button>
            </div>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default Movies;
