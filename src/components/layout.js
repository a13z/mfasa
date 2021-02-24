import React from 'react';
import PropTypes from 'prop-types';
import { CssBaseline } from '@material-ui/core';
import Header from './header';
import './layout.css';

const Layout = ({ children }) => (
  <>
    <CssBaseline />
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
