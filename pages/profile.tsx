import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChangePassword from '../components/ChangePassword';
import DeleteUser from '../components/DeleteUser';
import Preferences from '../components/Preferences';
import { getSessionByToken } from '../database/sessions';
import { getUserByToken, User } from '../database/user';
import { createTokenFromSecret } from '../utils/csrf';
import { RecommendedMovie } from './movies';

type ConditionalProps = { user: User } | { message: string };

type Props = ConditionalProps & {
  refreshUserProfile: () => void;
  csrfToken?: string;
};
export default function Profile(props: Props) {
  const [savedRecommendations, setSavedRecommendations] = useState<
    RecommendedMovie[]
  >([]);

  useEffect(() => {
    fetch('api/movies/history')
      .then((res) => res.json())
      .then((data) => {
        setSavedRecommendations(data.history);
      })
      .catch((err) => console.log(err));
  }, []);
  async function handleDeleteSaved(
    title: RecommendedMovie['title'],
    year: RecommendedMovie['release_year'],
  ) {
    // remove from the frontend
    const displayed = savedRecommendations;
    setSavedRecommendations(
      displayed.filter((movie) => {
        return movie.title !== title && movie.release_year !== year;
      }),
    );
    // remove from database
    const response = await fetch('api/movies/history', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        year: year,
        csrfToken: props.csrfToken,
      }),
    });
    const data = await response.json();
    return data;
  }

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
                width: 800,
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
            <Accordion
              sx={{
                width: 800,
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
                <h3>Change Password</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Change your password here </Typography>
                <ChangePassword csrfToken={props.csrfToken} />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                width: 800,
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
          <hr />
          <div>
            <Typography variant="h5">Your saved recommendations</Typography>
            <hr />
            {savedRecommendations.length > 0 ? (
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0.5}
              >
                {savedRecommendations.map((movie) => {
                  return (
                    <Grid
                      item
                      key={`saved movie ${movie.title}`}
                      xs={12}
                      sm={4}
                      lg={3}
                    >
                      <Card
                        key={`saved movie ${movie.title}`}
                        sx={{
                          width: 300,
                          background: 'rgba(255, 255, 255, 0.7)',
                        }}
                        variant="outlined"
                        data-test-id={`saved-movie-${movie.title}`}
                      >
                        <CardContent>
                          <Typography variant="h5">
                            {movie.title} ({movie.releaseYear})
                          </Typography>
                          {movie.poster ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/original${movie.poster}`}
                              height={250}
                              width={180}
                              alt={`Poster of ${movie.title}`}
                            />
                          ) : (
                            <p>No poster found</p>
                          )}
                          <Typography variant="body1">
                            {movie.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() =>
                              handleDeleteSaved(movie.title, movie.releaseYear)
                            }
                          >
                            Remove
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <>
                <Typography variant="h5">Nothing to show!</Typography>
                <Typography variant="body1">
                  Get recommendations and save them for future use!
                </Typography>
              </>
            )}
          </div>
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
