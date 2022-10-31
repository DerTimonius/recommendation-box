import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ChangePassword from '../components/ChangePassword';
import DeleteUser from '../components/DeleteUser';
import { getSessionByToken } from '../database/sessions';
import { getUserByToken, User } from '../database/user';
import { createTokenFromSecret } from '../utils/csrf';
import { Error, RegisterResponseType } from './api/register';

type ConditionalProps = { user: User } | { message: string };

type Props = ConditionalProps & {
  refreshUserProfile: () => void;
  csrfToken?: string;
};
export default function Profile(props: Props) {
  const [bollywoodPreference, setBollywoodPreference] = useState<boolean>();
  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [displayMessage, setDisplayMessage] = useState(false);

  useEffect(() => {
    if ('user' in props) {
      setBollywoodPreference(props.user.preferences);
    }
  }, [props]);

  async function handleSaveChange() {
    const response = await fetch('/api/changeBollywoodSetting', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        preferences: bollywoodPreference,
        csrfToken: props.csrfToken,
      }),
    });
    const data: RegisterResponseType = await response.json();
    if ('errors' in data) {
      setErrors([...errors, data.errors]);
      return;
    }
    setDisplayMessage(true);
    setIsButtonClickable(false);
  }
  if ('user' in props) {
    return (
      <>
        <Head>
          <title>Profile of {props.user.username}</title>
          <meta
            name="description"
            content={`Profile page of ${props.user.username}`}
          />
        </Head>
        <div>
          <h3>Hello {props.user.username}</h3>
          <div>
            <h3>Account settings</h3>
            <hr />
            <div>
              <label htmlFor="bollywood">
                Exclude bollywood movies from search results
              </label>
              <input
                type="checkbox"
                name="bollywood"
                id="bollywood"
                value={bollywoodPreference}
                onChange={(event) => {
                  setBollywoodPreference(event.currentTarget.checked);
                  setIsButtonClickable(true);
                }}
              />
              <button disabled={!isButtonClickable} onClick={handleSaveChange}>
                Save changes
              </button>
              {displayMessage ? (
                <h6>Saved successfully!</h6>
              ) : (
                errors.map((error) => {
                  return (
                    <h4 key={`error ${error.message}`}>{error.message}</h4>
                  );
                })
              )}
            </div>
            <div>
              <ChangePassword csrfToken={props.csrfToken} />
            </div>
            <div>
              <DeleteUser
                refreshUserProfile={props.refreshUserProfile}
                csrfToken={props.csrfToken}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Restricted Area</title>
        <meta name="description" content="restricted area, login necessary" />
      </Head>
      <div>
        <h2>Restricted area, login necessary!</h2>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const session = token && (await getSessionByToken(token));
  const user = token && (await getUserByToken(token));
  if (!user || !session) {
    return {
      props: {
        message: 'unauthorized',
        csrfToken: undefined,
      },
    };
  }

  const csrfToken = createTokenFromSecret(session.csrfToken);
  return {
    props: {
      user: user,
      csrfToken: csrfToken,
    },
  };
}
