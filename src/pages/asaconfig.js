import React from 'react';
import PropTypes from 'prop-types';

import { Container, Grid } from '@material-ui/core';

import Layout from '../components/layout';
import ASAForm from '../components/AsaForm/ASAForm.component';

const ASAConfig = ({ assetId }) => (
  <Layout>
    <title>ASA Config</title>
    <Container>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item>
          <h2>ASA Config</h2>
        </Grid>
      </Grid>
      <ASAForm assetId={parseInt(assetId)} />
    </Container>
  </Layout>
);

export default ASAConfig;
ASAConfig.propTypes = {
  assetId: PropTypes.string,
};

ASAConfig.defaultProps = {
  assetId: '',
};
