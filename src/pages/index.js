import React, { useState, useContext, useEffect } from 'react';
import { Router } from '@reach/router';

import axios from 'axios';

import { Container } from '@material-ui/core';
import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import ASAOverview from './asaoverview';
import ASAManager from './asamanager';
import ASAConfig from './asaconfig';
import Reports from './reports';

import AlgoClient from '../services/AlgoClient';

const IndexPage = (props) => {
  const ctx = useContext(AlgoSignerContext);
  const [accountDetails, setAccountDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (ctx.currentAddress) {
      const algoClient = new AlgoClient(ctx.ledger);
      algoClient.getIndexer().lookupAccountByID(ctx.currentAddress).do()
        .then((response) => {
          console.log(response);
          setAccountDetails(response.account);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [ctx]);
  return (
    <Layout>
      <Router>
        <ASAOverview path="/" />
        <ASAManager path="/asamanager/:assetId" />
        <ASAConfig path="/asaconfig/:assetId" />
        <Reports path="/reports" />
      </Router>
    </Layout>
  );
};

export default IndexPage;
