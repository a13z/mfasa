import React from 'react';
import { Container, Grid } from '@material-ui/core';

import Layout from '../components/layout';
import ASAForm from '../components/AsaForm/ASAForm.component';

const ASAConfig = () => (
  <Layout>
    <title>ASA Config</title>
    <Container>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item>
          <h2>ASA Config</h2>
        </Grid>
      </Grid>
      <ASAForm />
    </Container>
  </Layout>
);

export default ASAConfig;
