import { css } from '@emotion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { TrendingMovieType } from './api/movies';

const landingPageStyles = css`
  grid-area: 'main';
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default function Home() {
  const [trending, setTrending] = useState<TrendingMovieType[]>();
  async function fetchTrendingData() {
    const response = await fetch('/api/movies');
    const data = await response.json();
    setTrending(data);
    console.log(trending);
  }
  useEffect(() => {
    fetchTrendingData().catch((error) => console.log(error));
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Movie Recommendations</title>
        <meta name="description" content="Get movie recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={landingPageStyles}>
        <h1>Get Movie Recommendations</h1>
        <br />
        <br />
        <br />
        <br />
        <h4>Try it out here!</h4>
      </div>
      <h5>Currently Trending</h5>
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
                <Grid item xs={4} key={`card for ${movie.title}`}>
                  <Card>
                    <CardMedia
                      component="img"
                      height={140}
                      image={`https://image.tmdb.org/t/p/original${movie.backdrop}`}
                    />
                    <CardContent>
                      <Typography>{movie.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          : null}
      </Grid>
    </div>
  );
}
