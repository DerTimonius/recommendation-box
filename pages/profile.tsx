import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByToken, User } from '../database/user';

type Props = {
  user?: User;
};
export default function Profile({ user }: Props) {
  if (user) {
    return (
      <>
        <Head>
          <title>Profile of {user.username}</title>
          <meta
            name="description"
            content={`Profile page of ${user.username}`}
          />
        </Head>
        <div>
          <h3>Hello {user.username}</h3>
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserByToken(token));
  if (!user) {
    return;
  }
  return {
    props: {
      user: user,
    },
  };
}
