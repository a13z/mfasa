import React from 'react';
import { Container, Grid } from '@material-ui/core';

import Layout from '../components/layout';

import ReportsForm from '../components/ReportsForm/ReportsForm.components';

const Reports = () => (
  <Layout>
    <title>Reports</title>
    <Container>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item>
          <h2>Reports</h2>
        </Grid>
      </Grid>
      <ReportsForm />
    </Container>
  </Layout>
);

export default Reports;
