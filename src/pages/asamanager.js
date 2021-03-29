import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, CircularProgress, Grid } from '@material-ui/core';
import Select from '@material-ui/core/Select';

import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import TxForm from '../components/TxForm/TxForm.component';
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
    <Layout>
      <title>ASA Manager</title>
      <Container>
        <Grid item align="center" justify="center" alignItems="center">

          { assetInformation ? (
            <h2>
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
            </h2>
          )
            : <h2 />}

        </Grid>
        {/* {loading ? <CircularProgress />
          : <ASAList data={asaSummary} />} */}
        <TxForm assetId={parseInt(assetId)} />
      </Container>
    </Layout>

  );
};
export default ASAManager;

ASAManager.propTypes = {
  assetId: PropTypes.string,
};

ASAManager.defaultProps = {
  assetId: 13672793,
};
