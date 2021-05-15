import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Grid } from '@material-ui/core';

import View from './View';
import ASAForm from './AsaForm/ASAForm.component';

import AlgoSignerContext from '../contexts/algosigner.context';

const ASAConfig = ({ assetId }) => {
  const ctx = useContext(AlgoSignerContext);
  const [assetInformation, setAssetInformation] = useState();
  const [loading, setLoading] = useState(true);

  return (
    <View title="ASA Config">
      <Container>
        <Grid container align="center" justify="center" alignItems="center">
          <Grid item>
            <h2>ASA Config</h2>
          </Grid>
        </Grid>
        <ASAForm assetId={parseInt(assetId)} />
      </Container>
    </View>
  );
};

export default ASAConfig;
// ASAConfig.propTypes = {
//   assetId: PropTypes.string,
// };

// ASAConfig.defaultProps = {
//   assetId: 13672793,
// };
