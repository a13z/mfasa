import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import ASATransactions from '../components/ASATransactions/ASATransactions.component';

// styles
const pageStyles = {
  color: '#232129',
  padding: '10px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 640,
};
const headingAccentStyles = {
  color: '#663399',
};
const paragraphStyles = {
  marginBottom: 48,
};
const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
};
const listItemStyles = {
  fontWeight: '300',
  fontSize: '24px',
  maxWidth: '560px',
};

const linkStyle = {
  color: '#8954A8',
  fontWeight: 'bold',
  fontSize: '16px',
  verticalAlign: '5%',
};

const docLinkStyle = {
  ...linkStyle,
  listStyleType: 'none',
  marginBottom: 24,
};

const descriptionStyle = {
  color: '#232129',
  fontSize: '14px',
};

const docLink = {
  text: 'Documentation',
  url: 'https://www.gatsbyjs.com/docs/',
  color: '#8954A8',
};

// markup
const IndexPage = () => (
  <Layout>
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>MFASA Overview</h1>

      <ASAList />
      <ASATransactions />
    </main>
  </Layout>
);

export default IndexPage;
