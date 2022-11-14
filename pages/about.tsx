import { css } from '@emotion/react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

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
    <div css={aboutStyles}>
      <Typography variant="h2">Final Project</Typography>
      <hr />
      <Typography variant="body1">
        This is my final project for the UpLeveled Web Development Bootcamp.
        What I tried to build was a movie recommendation system that two persons
        can use.
      </Typography>
      <Typography variant="body1">
        If they can't decide what movie or TV series to watch, each can pick
        three movies/series of the kind they would like to watch.
      </Typography>
      <br />
      <Typography variant="body1">
        I build a recommendation system using datasets from{' '}
        <Link href="https://www.kaggle.com/datasets/shivamb/netflix-shows">
          Netflix
        </Link>{' '}
        and{' '}
        <Link href="https://www.kaggle.com/datasets/shivamb/amazon-prime-movies-and-tv-shows">
          Amazon
        </Link>{' '}
        and machine learning/data science algorithms to determine the best pick,
        that most fits each of the desired movies/series.
      </Typography>
      <Typography variant="body1">
        This application also uses the{' '}
        <abbr title="The Movie Database">TMDb</abbr>{' '}
        <Link href="https://developers.themoviedb.org/3/getting-started/introduction">
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
    </div>
  );
}

export default About;
