import { useRouter } from 'next/router';
import { useState } from 'react';
import { Error } from '../pages/api/register';

type Props = {
  refreshUserProfile: () => void;
  csrfToken?: string;
};

export default function DeleteUser({ refreshUserProfile, csrfToken }: Props) {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  async function handleDelete() {
    if (!password) {
      setErrors([...errors, { message: 'Please enter your password' }]);
    }
    const response = await fetch('/api/deleteUser', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        csrfToken: csrfToken,
      }),
    });
    const data = await response.json();
    if ('errors' in data) {
      setErrors([...errors, data.errors]);
      return;
    }
    await router.push('/');
    refreshUserProfile();
  }
  return (
    <div>
      <h4>Sad to see you leave!</h4>
      <br />
      <p>Please enter your password to delete your account!</p>
      <div>
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <button onClick={handleDelete}>Delete account</button>
        {errors.length > 0
          ? errors.map((error) => (
              <h4 key={`error ${error.message}`}>{error.message}</h4>
            ))
          : null}
      </div>
    </div>
  );
}
