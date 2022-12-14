import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getSessionByToken } from '../database/sessions';
import { User } from '../database/user';
import { formStyles } from '../styles/formStyles';
import { validateInput } from '../utils/validateInput';
import { Error, RegisterResponseType } from './api/register';

type Props = {
  refreshUserProfile: () => void;
};

export default function Register({ refreshUserProfile }: Props) {
  const [username, setUsername] = useState<User['username']>('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    if (
      !validateInput(username) ||
      !validateInput(password1) ||
      !validateInput(password2)
    ) {
      setErrors([
        ...errors,
        { message: 'No space allowed in username or password!' },
      ]);
      return;
    }
    if (password1 === password2) {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password1 }),
      });
      const data: RegisterResponseType = await response.json();
      if ('errors' in data) {
        setErrors([...errors, data.errors]);
        return;
      }
      // refresh the user on state
      refreshUserProfile();
      // redirect user to user profile
      await router.push(`/profile`);
    }
    setErrors([
      ...errors,
      { message: 'Passwords not matching, please try again' },
    ]);
    setPassword1('');
    setPassword2('');
  }

  return (
    <>
      <Head>
        <title>Register user</title>
        <meta name="description" content="Register user" />
      </Head>
      <div css={formStyles}>
        <Typography variant="h4">Create an account and get started!</Typography>
        {errors.length > 0 &&
          errors.map((error) => {
            return (
              <Typography variant="subtitle1" key={`error ${error.message}`}>
                {error.message}
              </Typography>
            );
          })}
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
                  value={password1}
                  onChange={(event) => setPassword1(event.currentTarget.value)}
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
                  id="confirmed-password"
                  label="Confirm Password"
                  variant="filled"
                  value={password2}
                  onChange={(event) => setPassword2(event.currentTarget.value)}
                  error={errors.length > 0}
                  sx={{
                    '@media (max-width: 720px)': {
                      width: 270,
                    },
                  }}
                />
              </FormControl>
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<AccountCircleIcon />}
                data-test-id="register-user"
                type="submit"
              >
                Create Account
              </Button>
            </form>
          </FormGroup>
        </Paper>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
