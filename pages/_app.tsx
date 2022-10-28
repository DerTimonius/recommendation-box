import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { Grid } from '@mui/material';
import { AppProps } from 'next/app';
import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { User } from '../database/user';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | undefined>();

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/userProfile');
    const profileResponseBody = await profileResponse.json();

    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);
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
          a:hover {
            font-size: 1.1em;
            transition: font-size ease-in 0.2s;
          }
        `}
      />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Sidebar user={user} />
        </Grid>
        <Grid item xs={9}>
          <Component {...pageProps} className="main" />
        </Grid>
      </Grid>
    </div>
  );
}

export default MyApp;
