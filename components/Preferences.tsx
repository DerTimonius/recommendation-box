import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';
import { Error, RegisterResponseType } from '../pages/api/register';

type Props = {
  csrfToken: string;
  preferences: boolean;
};

export default function Preferences({ csrfToken, preferences }: Props) {
  const [bollywoodPreference, setBollywoodPreference] = useState(preferences);
  const [errors, setErrors] = useState<Error[]>([]);
  const [saveSuccessful, setSaveSuccessful] = useState(false);

  async function handleClick() {
    const response = await fetch('/api/user/changeBollywoodSetting', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        preferences: bollywoodPreference,
        csrfToken: csrfToken,
      }),
    });
    const data: RegisterResponseType = await response.json();
    if ('errors' in data) {
      setErrors([data.errors]);
      return;
    }
    setSaveSuccessful(true);
  }
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={bollywoodPreference}
            value={bollywoodPreference}
            onChange={(event) => {
              setBollywoodPreference(event.target.checked);
              if (saveSuccessful) {
                setSaveSuccessful(false);
              }
            }}
          />
        }
        label="Exclude bollywood movies from search results"
      />
      <br />
      <Button
        startIcon={saveSuccessful ? <DoneIcon /> : <SaveIcon />}
        variant="contained"
        color="primary"
        onClick={handleClick}
        data-test-id="change-preferences-button"
      >
        {saveSuccessful ? <>Saved</> : <>Save Changes</>}
      </Button>
      {errors.length > 0 &&
        errors.map((error) => {
          return <h4 key={`error ${error.message}`}>{error.message}</h4>;
        })}
    </>
  );
}
