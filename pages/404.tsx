import Button from '@mui/material/Button';
import Head from 'next/head';
import Link from 'next/link';

export default function page404() {
  return (
    <>
      <Head>
        <title>404 - not found</title>
        <meta name="description" content="404 page" />
      </Head>
      <h2>404 - Nothing to see here, please disperse!</h2>
      <Link href="/">
        <Button variant="contained" color="info">
          Get back to homepage!
        </Button>
      </Link>
    </>
  );
}
