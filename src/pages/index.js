import React, { useState, useContext, useEffect } from 'react';
import { Router } from '@reach/router';
import { Link } from 'gatsby';
import axios from 'axios';

import { Container } from '@material-ui/core';
import Layout from '../components/Layout';
import AlgoSignerContext from '../contexts/algosigner.context';

// import ASAOverview from './app/asaoverview';
// import ASAManager from './asamanager';
// import ASAConfig from './app/asaconfig';
// import Reports from './reports';
// import ASAList from '../components/ASAList/ASAList.component';

import Login from '../components/Login';
import PrivateRoute from '../components/PrivateRoute';

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
      {/* <Router>
        <ASAOverview path="/" />
        <ASAManager path="/asamanager/:assetId" />
        <ASAConfig path="/asaconfig" />
        <Reports path="/reports" />
      </Router> */}
      <Link to="/app/login">Login</Link>
    </Layout>
  );
};

export default IndexPage;
