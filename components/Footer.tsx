import Link from 'next/link';
import React from 'react';

function Footer() {
  return (
    <footer>
      Logo
      <Link href="/contact">Contact me!</Link>
      copyright Timon Jurschitsch 2022
    </footer>
  );
}

export default Footer;
