import { css } from '@emotion/react';
import React from 'react';

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
      <h2>Final Project</h2>
      <hr />
      <p>
        This is my final project for the UpLeveled Web Development Bootcamp.
        What I tried to build was a movie recommendation system that two persons
        can use.
      </p>
      <p>
        If they can't decide what movie or TV series to watch, each can pick
        three movies/series of the kind they would like to watch.
      </p>
      <br />
      <p>
        I build a recommendation system using datasets from Netflix and Amazon
        (INSERT LINK HERE) and machine learning/data science algorithms to
        determine the best pick, that most fits each of the desired
        movies/series.
      </p>
      <p>
        This application also uses the{' '}
        <abbr title="The Movie Database">TMDb</abbr> API to get further
        informations of the movie (is it available at streaming platforms, is it
        any good, provide links etc.)
      </p>
    </div>
  );
}

export default About;
