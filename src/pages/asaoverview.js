import React, { useState, useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import axios from 'axios';

import { Container, Grid } from '@material-ui/core';
import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import ASATransactions from '../components/ASATransactions/ASATransactions.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import AlgoSdk from '../services/AlgoSdk';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ASAOverview = () => {
  const ctx = useContext(AlgoSignerContext);
  const [accountDetails, setAccountDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    if (ctx.currentAddress) {
      axios
        .get(
          `https://api.testnet.algoexplorer.io/idx2/v2/accounts/${ctx.currentAddress}`,
        )
        .then((res) => {
          console.log(res.data.account);
          setAccountDetails(res.data.account);
          setLoading(false);
        // res.data['created-assets'].map((item) => {
        //   console.log(item.index);
        //   console.log(item.params.name, item.params.total);
        //   axios
        //     .get(
        //       `https://api.testnet.algoexplorer.io/idx2/v2/assets/13672793/balances`
        //     )
        //     .then((res) => {
        //       console.log(res);
        //       const newBalances = res.data.balances.map((obj) => obj.address);
        //       console.log(newBalances);
        //       setAccountDetails({ balances: newBalances });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [ctx]);
  return (
    <>
      <title>ASA Overview</title>

      <Container className={classes.root}>
        <Grid container align="center" justify="center" alignItems="center">
          <Grid item>
            <h2>ASA Overview</h2>
          </Grid>
        </Grid>
        { accountDetails['created-assets'] ? (
          <>
            <ASAList data={accountDetails['created-assets']} loading={loading} />
            <Grid container align="center" justify="center" alignItems="center">
              <Grid item>
                <h2>Transactions</h2>
              </Grid>
            </Grid>
            <ASATransactions asaList={accountDetails['created-assets']} loading={loading} />
          </>
        ) : (
          <h1>Select an account or this account has not created any ASA</h1>
        )}
      </Container>
    </>
  );
};

export default ASAOverview;
