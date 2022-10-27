import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { Grid } from '@mui/material';
import { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            margin: 0;
            box-sizing: border-box;
          }
          html {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
            background-color: black;
            color: #b9e25e;
          }
          /*           body {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 10px;
            grid-template-areas: 'sidebar main right';
            height: 100vh;
          } */
          a:hover {
            font-size: 1.1em;
            transition: font-size ease-in 0.2s;
          }
        `}
      />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        <Grid item xs={9}>
          <Component {...pageProps} className="main" />
        </Grid>
      </Grid>
    </div>
  );
}

export default MyApp;
