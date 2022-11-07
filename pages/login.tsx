import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
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
    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
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
              return <h5 key={`error ${error.message}`}>{error.message}</h5>;
            })
          : null}
        <FormGroup>
          <FormControl margin="normal">
            <TextField
              id="username"
              label="Username"
              variant="filled"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </FormControl>
          <FormControl margin="normal">
            <TextField
              type="password"
              id="password"
              label="Password"
              variant="filled"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<AccountCircleIcon />}
          >
            Login
          </Button>
        </FormGroup>
        {/* <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            id="username"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            id="userpasswordname"
          />
          <button onClick={handleSubmit}>Log In</button>
        </form> */}
      </div>
    </>
  );
}
