import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { useState } from 'react';
import { Error } from '../pages/api/register';
import { validateInput } from '../utils/validateInput';

type Props = {
  csrfToken: string | undefined;
};
export default function ChangePassword({ csrfToken }: Props) {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const [saveSuccessful, setSaveSuccessful] = useState(false);

  async function handleChangePassword(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    setErrors([]);
    if (
      !validateInput(newPassword) ||
      !validateInput(password) ||
      !validateInput(confirmedPassword)
    ) {
      setErrors([{ message: 'No spaces allowed in username or password' }]);
      return;
    }
    if (newPassword === confirmedPassword) {
      const response = await fetch('/api/user/changePassword', {
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
        setErrors([data.errors]);
        return;
      }
      setSaveSuccessful(true);
      return;
    }
    setErrors([{ message: 'passwords are not matching' }]);
  }
  return (
    <>
      <FormGroup>
        <form
          onSubmit={handleChangePassword}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <FormControl margin="normal">
            <InputLabel htmlFor="current-password">Current Password</InputLabel>
            <Input
              id="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              margin="dense"
              type="password"
              error={errors.length > 0}
            />
          </FormControl>
          <FormControl margin="normal">
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <Input
              id="new-password"
              required={true}
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
              margin="dense"
              type="password"
              error={errors.length > 0}
            />
          </FormControl>
          <FormControl margin="normal">
            <InputLabel htmlFor="confirmed-password">
              Confirm New Password
            </InputLabel>
            <Input
              error={errors.length > 0}
              id="confirmed-password"
              required={true}
              value={confirmedPassword}
              onChange={(event) =>
                setConfirmedPassword(event.currentTarget.value)
              }
              margin="dense"
              type="password"
            />
          </FormControl>
          <Button
            startIcon={saveSuccessful ? <DoneIcon /> : <SaveIcon />}
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            data-test-id="change-password-button"
            type="submit"
          >
            {saveSuccessful ? <>Saved</> : <>Save Password</>}
          </Button>
        </form>
      </FormGroup>
      {errors.length > 0 &&
        errors.map((error) => {
          return <h4 key={`error ${error.message}`}>{error.message}</h4>;
        })}
    </>
  );
}
