import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { User } from '../database/user';
import { formStyles } from '../styles/formStyles';
import { LoginResponseType } from './api/login';

export default function Login() {
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

    /* // refresh the user on state
      await props.refreshUserProfile(); */
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
        <h4>Login to get going</h4>
        {errors.length > 0
          ? errors.map((error) => {
              return <h5 key={`error ${error.message}`}>{error.message}</h5>;
            })
          : null}
        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
    </>
  );
}
