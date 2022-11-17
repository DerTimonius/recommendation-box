import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Error } from '../pages/api/register';
import { validateInput } from '../utils/validateInput';

type Props = {
  csrfToken: string | undefined;
  refreshUserProfile: () => void;
};
export default function ChangeUsername({
  csrfToken,
  refreshUserProfile,
}: Props) {
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const [saveSuccessful, setSaveSuccessful] = useState(false);

  async function handleChangeUsername(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    setErrors([]);
    if (!validateInput(newUsername) || !validateInput(password)) {
      setErrors([{ message: 'No spaces allowed in username or password' }]);
      return;
    }
    if (newUsername) {
      const response = await fetch('/api/user/changeUsername', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          csrfToken: csrfToken,
          newUsername: newUsername,
        }),
      });
      const data = await response.json();
      if ('errors' in data) {
        setErrors([data.errors]);
        return;
      }
      setSaveSuccessful(true);
      refreshUserProfile();
      return;
    }
    setErrors([{ message: 'no username passed' }]);
  }
  return (
    <>
      <Typography variant="body1">
        Nothings lasts forever, not even usernames! But just to make sure,
        please enter your password.
      </Typography>
      <Typography variant="body2">
        You might need to refresh the page to see the change!
      </Typography>
      <FormGroup>
        <form
          onSubmit={handleChangeUsername}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <FormControl margin="normal">
            <InputLabel htmlFor="new-username">New Username</InputLabel>
            <Input
              id="new-username"
              required
              value={newUsername}
              onChange={(event) => setNewUsername(event.currentTarget.value)}
              margin="dense"
              error={errors.length > 0}
            />
          </FormControl>
          <FormControl margin="normal">
            <InputLabel htmlFor="password">Enter your password</InputLabel>
            <Input
              id="password"
              required={true}
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              margin="dense"
              type="password"
              error={errors.length > 0}
            />
          </FormControl>
          <Button
            startIcon={saveSuccessful ? <DoneIcon /> : <SaveIcon />}
            variant="contained"
            color="primary"
            onClick={handleChangeUsername}
            data-test-id="change-username-button"
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
