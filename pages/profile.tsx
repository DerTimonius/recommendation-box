import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import ChangePassword from '../components/ChangePassword';
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
        <div>
          <h3>Hello {props.user.username}</h3>
          <div>
            <h3>Account settings</h3>
            <hr />
            <Accordion sx={{ width: 800 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="change-preferences"
                id="change-preferences"
              >
                <h3>Change preferences</h3>
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
            <Accordion sx={{ width: 800 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="change-password"
                id="change-password"
              >
                <h3>Change Password</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Change your password here </Typography>
                <ChangePassword csrfToken={props.csrfToken} />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: 800 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-label="delete-account"
                id="delete-account"
              >
                <h3>Delete account</h3>
              </AccordionSummary>
              <AccordionDetails>
                <DeleteUser
                  refreshUserProfile={props.refreshUserProfile}
                  csrfToken={props.csrfToken}
                />
              </AccordionDetails>
            </Accordion>
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
