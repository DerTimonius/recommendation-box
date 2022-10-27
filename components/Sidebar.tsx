import { css } from '@emotion/react';
import Link from 'next/link';

const sidebarStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-right: 1px solid #b9e25e;
  height: max-content;
  z-index: 10;
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

function Sidebar() {
  return (
    <div css={sidebarStyles}>
      <div> Logo here</div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/about">How it works</Link>
        <Link href="/login">Log In</Link>
        <Link href="/register">Sign Up</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
