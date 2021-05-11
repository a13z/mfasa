import React, { useState, useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import axios from 'axios';

import { Container, Grid } from '@material-ui/core';
import Layout from './Layout';
import ASAList from './ASAList/ASAList.component';
import ASATransactionsTable from './ASATransactionsTable/ASATransactionsTable.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import AlgoClient from '../services/AlgoClient';

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
const createdAssets = {};

const ASAOverview = () => {
  const ctx = useContext(AlgoSignerContext);
  const [accountDetails, setAccountDetails] = useState({});
  const [assets, setAssets] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    if (ctx.currentAddress) {
      console.log('ctx.ledger ');
      console.log(ctx.ledger);
      const algoClient = new AlgoClient(ctx.ledger);
      algoClient.getIndexer().lookupAccountByID(ctx.currentAddress).do()
        .then((response) => {
          console.log(response);
          setAccountDetails(response.account);
          const asaTransactions = [];

          response.account['created-assets'].forEach((asset) => {
            createdAssets[asset.index] = asset.params;
            console.log(createdAssets[asset.index]);
          });
          console.log(JSON.stringify(createdAssets));
          setAssets(createdAssets);

          Promise.all(response.account['created-assets'].map((asa) => algoClient.indexer.lookupAssetTransactions(asa.index).do()))
            .then((response) => {
              console.log('Promise all fetching transactions for asaList');
              console.log(response);
              response.forEach((item) => {
                asaTransactions.push(...item.transactions);
              });
              console.log('ASATransactions: useEffect asaTransactions array:');
              console.log(asaTransactions);
              setTransactions(asaTransactions);
              setLoading(false);
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              setLoading(false);
            });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
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
            <ASATransactionsTable transactions={transactions} assetsCreated={createdAssets} loading={loading} />
          </>
        ) : (
          <h1>Select an account or this account has not created any ASA</h1>
        )}
      </Container>
    </>
  );
};

export default ASAOverview;
