import { useState } from 'react';
import { Error } from '../pages/api/register';

type Props = {
  csrfToken: string | undefined;
};
export default function ChangePassword({ csrfToken }: Props) {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [displayMessage, setDisplayMessage] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  async function handleChangePassword(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    if (newPassword === confirmedPassword) {
      const response = await fetch('/api/changePassword', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          newPassword: newPassword,
          csrfToken: csrfToken,
        }),
      });
      const data = await response.json();
      if ('errors' in data) {
        setErrors([...errors, data.errors]);
        return;
      }
      setDisplayMessage(true);
    }
    setErrors([...errors, { message: 'passwords are not matching' }]);
  }
  return (
    <>
      <button onClick={() => setButtonClicked(true)}>Change password</button>
      {buttonClicked ? (
        <form onSubmit={handleChangePassword}>
          <label htmlFor="current">Current password</label>
          <input
            type="password"
            name="current"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <label htmlFor="newPassword">New password</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.currentTarget.value)}
          />
          <label htmlFor="confirmedPassword">Confirm password</label>
          <input
            type="password"
            name="confirmedPassword"
            value={confirmedPassword}
            onChange={(event) =>
              setConfirmedPassword(event.currentTarget.value)
            }
          />
          <button onClick={handleChangePassword}>Save changes</button>
          {displayMessage ? <h4>Password changed successfully</h4> : null}
        </form>
      ) : null}
    </>
  );
}
