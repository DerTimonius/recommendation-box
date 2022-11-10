import Link from 'next/link';

export default function NotLoggedIn() {
  return (
    <div>
      <h3>Do you also want to get recommendations based on multiple movies?</h3>
      <p>
        <Link href="/login">Log in to your account</Link> or{' '}
        <Link href="/register">
          <a data-test-id="movie-register-link">create a free account</a>
        </Link>{' '}
        to get going!
      </p>
    </div>
  );
}
