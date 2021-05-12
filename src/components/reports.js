import React from 'react';
import { Container, Grid } from '@material-ui/core';

import View from './View';

import ReportsForm from './ReportsForm/ReportsForm.components';

const Reports = () => (
  <View title="ASA Reports">
    <title>Reports</title>
    <Container>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item>
          <h2>Reports</h2>
        </Grid>
      </Grid>
      <ReportsForm />
    </Container>
  </View>
);

export default Reports;
