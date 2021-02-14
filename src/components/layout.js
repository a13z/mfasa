import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';
import './layout.css';

const Layout = ({ children }) => (
  <>
    <Header siteTitle="MFASA" />
    <main>{children}</main>
    <footer>
      © MFASA
      {' '}
      {new Date().getFullYear()}
    </footer>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
