import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, CircularProgress, Grid } from '@material-ui/core';

import View from './View';
import TxForm from './TxForm/TxForm.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import AlgoClient from '../services/AlgoClient';

const ASAManager = ({ assetId }) => {
  console.log('ASAManager id props');
  console.log(assetId);

  const ctx = useContext(AlgoSignerContext);
  const [assetInformation, setAssetInformation] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const algoClient = new AlgoClient(ctx.ledger);

    algoClient.getAssetInformation(parseInt(assetId))
      .then((response) => {
        console.log(JSON.stringify(response));
        setAssetInformation(response.asset);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });

    // return () => {
    //   cleanup
    // }
  }, []);

  // const canonicalUrl = props.data.site.siteMetadata.siteURL + props.location.pathname;

  return (
    <View title="ASA Manager">
      <Container>
        <Grid item align="center" justify="center" alignItems="center">

          { assetInformation ? (
            <h3>
              Managing
              {' '}
              <b>
                {assetInformation.params.name}
              </b>
              {' '}
              asset with index id
              {' '}
              <b>
                {assetInformation.index}
              </b>
            </h3>
          )
            : <h3 />}

        </Grid>
        {/* {loading ? <CircularProgress />
          : <ASAList data={asaSummary} />} */}
        <TxForm assetId={parseInt(assetId)} />
      </Container>
    </View>

  );
};
export default ASAManager;

ASAManager.propTypes = {
  assetId: PropTypes.string,
};

ASAManager.defaultProps = {
  assetId: 13672793,
};
