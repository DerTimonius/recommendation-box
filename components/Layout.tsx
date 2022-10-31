import React from 'react';
import Footer from './Footer';
import Header from './Sidebar';

type Props = {
  children: JSX.Element;
};
function Layout(props: Props) {
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
