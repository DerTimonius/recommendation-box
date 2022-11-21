import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import ChangePassword from '../components/ChangePassword';
import ChangeUsername from '../components/ChangeUsername';
import DeleteUser from '../components/DeleteUser';
import Preferences from '../components/Preferences';
import { getSessionByToken } from '../database/sessions';
import { getUserByToken, User } from '../database/user';
import { createTokenFromSecret } from '../utils/csrf';

type ConditionalProps = { user: User } | { message: string };

type Props = ConditionalProps & {
  refreshUserProfile: () => void;
  csrfToken?: string;
};
export default function Profile(props: Props) {
  if ('user' in props && props.csrfToken) {
    return (
      <>
        <Head>
          <title>Profile of {props.user.username}</title>
          <meta
            name="description"
            content={`Profile page of ${props.user.username}`}
          />
        </Head>
        <main>
          <Typography variant="h4" data-test-id="profile-greeting">
            Hello {props.user.username}
          </Typography>
          <div>
            <Typography variant="h5">Account settings</Typography>
            <hr />
            <Accordion
              sx={{
                width: '100vw - 50px',
                background: 'rgba(255, 255, 255, 0.5)',
                '@media (max-width: 720px)': {
                  width: '360px',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="change-preferences"
                id="change-preferences"
                data-test-id="profile-preferences"
              >
                <Typography variant="h5">
                  Change Bollywood preferences
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Not everyone is a fan of monumental Bollywood movies, so if
                  you'd like, you can exclude them!
                </Typography>
                <hr />
                <Preferences
                  csrfToken={props.csrfToken}
                  preferences={props.user.preferences}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                width: '100vw - 50px',
                background: 'rgba(255, 255, 255, 0.5)',
                '@media (max-width: 720px)': {
                  width: '360px',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="change-password"
                id="change-password"
                data-test-id="profile-change-password"
              >
                <Typography variant="h5">Change password</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Change your password here </Typography>
                <ChangePassword csrfToken={props.csrfToken} />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                width: '100vw - 50px',
                background: 'rgba(255, 255, 255, 0.5)',
                '@media (max-width: 720px)': {
                  width: '360px',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="change-username"
                id="change-username"
                data-test-id="profile-change-username"
              >
                <Typography variant="h5">Change username</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChangeUsername
                  csrfToken={props.csrfToken}
                  refreshUserProfile={props.refreshUserProfile}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                width: '100vw - 50px',
                background: 'rgba(255, 255, 255, 0.5)',
                '@media (max-width: 720px)': {
                  width: '360px',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="delete-account"
                id="delete-account"
                data-test-id="profile-delete-account"
              >
                <Typography variant="h5">Delete account</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DeleteUser
                  refreshUserProfile={props.refreshUserProfile}
                  csrfToken={props.csrfToken}
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <hr />
        </main>
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
