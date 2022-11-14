import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { User } from '../database/user';
import { formStyles } from '../styles/formStyles';
import { LoginResponseType } from './api/login';
import { Error } from './api/register';

type Props = {
  refreshUserProfile: () => void;
};

export default function Login({ refreshUserProfile }: Props) {
  const [username, setUsername] = useState<User['username']>('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data: LoginResponseType = await response.json();
    if ('errors' in data) {
      setErrors([...errors, data.errors]);
      return;
    }
    // refresh the user on state
    refreshUserProfile();
    // redirect user to user profile
    await router.push(`/movies`);
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="login page" />
      </Head>
      <div css={formStyles}>
        <Typography variant="h4">Login to get going</Typography>
        {errors.length > 0
          ? errors.map((error) => {
              return (
                <Typography variant="subtitle1" key={`error ${error.message}`}>
                  {error.message}
                </Typography>
              );
            })
          : null}
        <Paper elevation={12}>
          <FormGroup
            sx={{
              '@media (max-width: 720px)': {
                width: 300,
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <FormControl margin="normal">
                <TextField
                  id="username"
                  label="Username"
                  variant="filled"
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  error={errors.length > 0}
                  sx={{
                    '@media (max-width: 720px)': {
                      width: 270,
                    },
                  }}
                />
              </FormControl>
              <FormControl margin="normal">
                <TextField
                  type="password"
                  id="password"
                  label="Password"
                  variant="filled"
                  value={password}
                  error={errors.length > 0}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  sx={{
                    '@media (max-width: 720px)': {
                      width: 270,
                    },
                  }}
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<AccountCircleIcon />}
                type="submit"
              >
                Login
              </Button>
            </form>
          </FormGroup>
        </Paper>
      </div>
    </>
  );
}
