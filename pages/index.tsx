import LiveTvIcon from '@mui/icons-material/LiveTv';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TrendingCard from '../components/TrendingCard';
import styles from '../styles/Home.module.css';
import { TrendingMovieType } from './api/movies';

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
        <title>RecommendationBox</title>
        <meta
          name="description"
          content="Get movie recommendations at RecommendationBox"
        />
      </Head>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              marginBottom: 12,
              backgroundImage: 'url(/img/main2.jpg)',
              backgroundRepeat: 'noRepeat',
              backgroundSize: 'cover',
              height: 680,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
          >
            <Grid
              item
              xs={9}
              sm={9}
              md={6}
              className="scrollable"
              sx={{
                overflowY: 'scroll',
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 6,
              }}
            >
              <Typography variant="h2">Don't know what to watch?</Typography>
              <Typography variant="h4">
                Tired of getting recommendations based on one movie only?
              </Typography>
              <Typography variant="subtitle1">
                Choose up to 6 of your favourite movies and TV shows and get
                recommendations!
              </Typography>
              <Link href="/movies">
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<LiveTvIcon />}
                  sx={{
                    width: 480,
                    '@media (max-width: 720px)': {
                      width: 240,
                    },
                  }}
                >
                  Let's get started!
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Typography variant="h5" align="center">
            Currently Trending on The Movie Database
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="flexStart"
            justifyContent="center"
            spacing={2}
            sx={{ marginTop: 2 }}
          >
            {Array.isArray(trending)
              ? trending.map((movie) => {
                  return (
                    <Grid item xs={12} lg={4} key={`card for ${movie.title}`}>
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
