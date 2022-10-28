import { css } from '@emotion/react';
import Link from 'next/link';
import { User } from '../database/user';

const sidebarStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-right: 1px solid #b9e25e;
  height: 100vh;
  div {
    margin-top: 96px;
  }
  nav {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 24px;
    padding: 12px;
    gap: 16px;
  }
`;
type Props = {
  user: User;
};
function Sidebar({ user }: Props) {
  return (
    <div css={sidebarStyles}>
      <div> Logo here</div>
      {user ? <div>Nice to see you, {user.username}!</div> : null}
      <nav>
        <Link href="/">Home</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/about">How it works</Link>
        {user ? (
          <>
            <Link href="/profile">Profile settings</Link>
            <a href="/logout">Log Out</a>
          </>
        ) : (
          <>
            <Link href="/login">Log In</Link>
            <Link href="/register">Sign Up</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
