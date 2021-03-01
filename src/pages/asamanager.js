import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, CircularProgress } from '@material-ui/core';
import Select from '@material-ui/core/Select';

import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import ASATransactions from '../components/ASATransactions/ASATransactions.component';
import TxForm from '../components/TxForm/TxForm.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import AlgoSdk from '../services/AlgoSdk';

const ASAManager = ({ assetId }) => {
  console.log('ASAManager id props');
  console.log(assetId);

  const ctx = useContext(AlgoSignerContext);

  const [asaSummary, setAsaSummary] = useState([]);
  const [asaTransactions, setAsaTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AlgoSdk.getAssetInformation(parseInt(assetId))
      .then((assetInformation) => {
        console.log(assetInformation);
        asaSummary.push(
          {
            index: parseInt(assetId),
            params: {
              name: assetInformation.assetname,
              total: assetInformation.total,
            },
          },
        );
        setAsaSummary(asaSummary);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });

    // return () => {
    //   cleanup
    // }
  }, []);

  console.log(asaSummary);

  // const canonicalUrl = props.data.site.siteMetadata.siteURL + props.location.pathname;

  return (
    <Layout>
      <title>ASA Manager</title>
      <Container>
        {loading ? <CircularProgress />
          : <ASAList data={asaSummary} />}
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
