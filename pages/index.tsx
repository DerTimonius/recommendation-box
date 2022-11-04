import { css } from '@emotion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import MUILink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import TrendingCard from '../components/TrendingCard';
import styles from '../styles/Home.module.css';
import { TrendingMovieType } from './api/movies';

const landingPageStyles = css`
  grid-area: 'main';
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-repeat: no-repeat;
  background-size: cover;
  height: 480px;
  * > * {
    backdrop-filter: blur(2px);
  }
`;
export default function Home() {
  const [trending, setTrending] = useState<TrendingMovieType[]>([]);
  const [loading, setLoading] = useState(false);
  async function fetchTrendingData() {
    const response = await fetch('/api/movies');
    const data = await response.json();
    return data;
  }
  useEffect(() => {
    setLoading(true);
    setTrending([]);
    fetchTrendingData()
      .then((data) => setTrending(data.result))
      .catch((error) => console.log(error));
    setLoading(false);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Movie Recommendations</title>
        <meta name="description" content="Get movie recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <div css={landingPageStyles}>
            {/* <h1>Get Movie Recommendations</h1>
            <br />
            <br />
            <br />
            <br />
            <h4>Try it out here!</h4> */}
          </div>
          <Typography variant="h5" align="center">
            Currently Trending
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            {Array.isArray(trending)
              ? trending.map((movie) => {
                  return (
                    <Grid item xs={3} key={`card for ${movie.title}`}>
                      {/* <Card>
                        <CardMedia
                          component="img"
                          height={250}
                          image={`https://image.tmdb.org/t/p/original${movie.backdrop}`}
                        />
                        <CardContent>
                          {movie.title !== movie.originalTitle ? (
                            <>
                              <Typography variant="h4">
                                {movie.originalTitle}
                              </Typography>
                              <Typography variant="h5">
                                {movie.title}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h4">{movie.title}</Typography>
                          )}
                          <Typography variant="body1">
                            {movie.overview}
                          </Typography>
                          <MUILink
                            href={`https://www.themoviedb.org/${movie.media}/${movie.id}`}
                            target="_blank"
                            rel="noreferrer"
                            underline="hover"
                          >
                            Learn more...
                          </MUILink>
                        </CardContent>
                      </Card> */}
                      <TrendingCard movie={movie} />
                    </Grid>
                  );
                })
              : null}
          </Grid>
        </>
      )}
    </div>
  );
}
