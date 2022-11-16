import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSessionByToken } from '../database/sessions';
import { getUserByToken, User } from '../database/user';
import { createTokenFromSecret } from '../utils/csrf';
import { RecommendedMovie } from './movies';

type ConditionalProps = { user: User } | { message: string };

type Props = ConditionalProps & {
  csrfToken?: string;
};
export default function History(props: Props) {
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
          <title>Your history</title>
          <meta
            name="description"
            content="See your saved recommendation history here"
          />
        </Head>
        <div>
          <Typography variant="h3">
            Your saved recommendations, {props.user.username}!
          </Typography>
          <hr />
          {savedRecommendations.length > 0 ? (
            <Grid
              container
              direction="row"
              alignItems="flexStart"
              justifyContent="center"
              spacing={3}
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
                      className="scrollable"
                      sx={{
                        width: 300,
                        background: 'rgba(255, 255, 255, 0.7)',
                        height: 520,
                        overflowY: 'scroll',
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
                          sx={{ marginRight: 2 }}
                        >
                          Remove
                        </Button>
                        {movie.tmdbId ? (
                          <Link
                            href={`https://www.themoviedb.org/${movie.media}/${movie.tmdbId}`}
                            target="_blank"
                            rel="noreferrer"
                            underline="hover"
                          >
                            Learn more...
                          </Link>
                        ) : null}
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
        </div>{' '}
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
