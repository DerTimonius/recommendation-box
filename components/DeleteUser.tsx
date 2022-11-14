import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
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
    const response = await fetch('/api/user/deleteUser', {
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
      <Typography variant="h5">Sad to see you leave!</Typography>

      <br />
      <Typography variant="body1">
        Please enter your password to delete your account!
      </Typography>
      <div>
        {errors.length > 0 &&
          errors.map((error) => (
            <h4 key={`error ${error.message}`}>{error.message}</h4>
          ))}
        <FormGroup>
          <FormControl margin="normal" variant="filled">
            <InputLabel htmlFor="password">Enter your password</InputLabel>
            <Input
              type="password"
              id="password"
              data-test-id="delete-user-password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              error={errors.length > 0 && true}
            />
          </FormControl>
          <Button
            color="warning"
            variant="contained"
            data-test-id="delete-user-button"
            onClick={handleDelete}
            startIcon={<ReportProblemIcon />}
          >
            Delete account
          </Button>
        </FormGroup>
      </div>
    </div>
  );
}
