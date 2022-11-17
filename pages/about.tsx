import { css } from '@emotion/react';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

const aboutStyles = css`
  position: absolute;
  top: 100px;
  z-index: 1;
  div {
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 920px;
  }
`;

function About() {
  return (
    <>
      <Head>
        <title>About RecommendationBox</title>
        <meta name="description" content="About page of RecommendationBox" />
      </Head>
      <div css={aboutStyles}>
        <Typography variant="h2">Welcome at RecommendationBox</Typography>
        <hr />
        <Typography variant="body1">
          This is my final project for the UpLeveled Web Development Bootcamp.
          What I tried to build was a movie recommendation system that takes
          more than just one input and gives you the best fit.
        </Typography>
        <Typography variant="body1">
          So if you can't decide what movie or TV series to watch, just look for
          a movie or TV show that you know and love!
        </Typography>
        <Typography variant="body1">
          You can get really crazy results depending on your selection, it's
          fun!
        </Typography>
        <br />
        <Typography variant="body1">
          I build a recommendation system using datasets from{' '}
          <Link
            href="https://www.kaggle.com/datasets/shivamb/netflix-shows"
            target="_blank"
            rel="noreferrer"
          >
            Netflix
          </Link>{' '}
          and{' '}
          <Link
            href="https://www.kaggle.com/datasets/shivamb/amazon-prime-movies-and-tv-shows"
            target="_blank"
            rel="noreferrer"
          >
            Amazon
          </Link>{' '}
          and machine learning/data science algorithms to determine the best
          pick, that most fits each of the desired movies/series.
        </Typography>
        <Typography variant="body1">
          This application also uses the{' '}
          <abbr title="The Movie Database">TMDb</abbr>{' '}
          <Link
            href="https://developers.themoviedb.org/3/getting-started/introduction"
            target="_blank"
            rel="noreferrer"
          >
            API
          </Link>{' '}
          to get further informations of the movie (is it available at streaming
          platforms, is it any good, provide links etc.)
        </Typography>
        <Typography variant="h3" sx={{ margin: '16px 0 12px' }}>
          What is about to come?
        </Typography>
        <Typography variant="body1">
          The plan is to provide a poster and TMDb link with every movie and TV
          show.
        </Typography>
        <Typography variant="body1">
          Also, I will at some point add the dataset for Disney+ into the mix.
        </Typography>
        <Typography variant="h3" sx={{ margin: '16px 0 12px' }}>
          Built by
        </Typography>
        <Typography variant="body2">© Timon Jurschitsch, 2022</Typography>
        <br />
        <Typography variant="body2">Reach out to me on Github:</Typography>
        <Link
          href="https://www.github.com/DerTimonius"
          target="_blank"
          rel="nonreferrer"
        >
          <GitHubIcon />
        </Link>
      </div>
    </>
  );
}

export default About;
