import React from 'react';
import { Container, Grid } from '@material-ui/core';

import View from './View';
import ASAForm from './AsaForm/ASAForm.component';

const ASAConfig = () => (
  <View title="ASA Config">
    <Container>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item>
          <h2>ASA Config</h2>
        </Grid>
      </Grid>
      <ASAForm />
    </Container>
  </View>
);

export default ASAConfig;
