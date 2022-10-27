import { css } from '@emotion/react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const landingPageStyles = css`
  grid-area: 'main';
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default function Home() {
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
    </div>
  );
}
