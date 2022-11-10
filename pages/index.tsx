import { css } from '@emotion/react';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
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
  /*   background-image: url('https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-repeat: no-repeat;
  background-size: cover; */
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
          <div css={landingPageStyles}>{null}</div>
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
                    <Grid
                      item
                      xs={12}
                      sm={5}
                      lg={4}
                      key={`card for ${movie.title}`}
                    >
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
