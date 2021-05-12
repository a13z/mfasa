import React, { useState, useContext, useEffect } from 'react';
import { Router } from '@reach/router';
import { navigate } from 'gatsby';
import axios from 'axios';

import { Container } from '@material-ui/core';

import AlgoSignerContext from '../contexts/algosigner.context';

import Login from '../components/Login';

import AlgoClient from '../services/AlgoClient';

const IndexPage = (props) => {
  const ctx = useContext(AlgoSignerContext);
  const [accountDetails, setAccountDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigate('/app/login');
    // setLoading(true);
    // if (ctx.currentAddress) {
    //   const algoClient = new AlgoClient(ctx.ledger);
    //   algoClient.getIndexer().lookupAccountByID(ctx.currentAddress).do()
    //     .then((response) => {
    //       console.log(response);
    //       setAccountDetails(response.account);
    //       setLoading(false);
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     });
    // }
  }, []);
  return (
    <Login />
  /* <Router>
        <ASAOverview path="/" />
        <ASAManager path="/asamanager/:assetId" />
        <ASAConfig path="/asaconfig" />
        <Reports path="/reports" />
      </Router> */
  //   <Link to="/app/login">Login</Link>
  // </Layout>
  );
};

export default IndexPage;
