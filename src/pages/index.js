import React, { useState, useContext, useEffect } from 'react';

import axios from 'axios';

import Layout from '../components/layout';
import ASAList from '../components/ASAList/ASAList.component';
import ASATransactions from '../components/ASATransactions/ASATransactions.component';
import AlgoSignerContext from '../contexts/algosigner.context';

import AlgoSdk from '../services/AlgoSdk';

// styles
const pageStyles = {
  color: '#232129',
  padding: '10px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 640,
};
const headingAccentStyles = {
  color: '#663399',
};
const paragraphStyles = {
  marginBottom: 48,
};
const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
};
const listItemStyles = {
  fontWeight: '300',
  fontSize: '24px',
  maxWidth: '560px',
};

const linkStyle = {
  color: '#8954A8',
  fontWeight: 'bold',
  fontSize: '16px',
  verticalAlign: '5%',
};

const docLinkStyle = {
  ...linkStyle,
  listStyleType: 'none',
  marginBottom: 24,
};

const descriptionStyle = {
  color: '#232129',
  fontSize: '14px',
};

const docLink = {
  text: 'Documentation',
  url: 'https://www.gatsbyjs.com/docs/',
  color: '#8954A8',
};

const IndexPage = () => {
  const ctx = useContext(AlgoSignerContext);
  const [accountDetails, setAccountDetails] = useState({});

  useEffect(() => {
    if (ctx.currentAddress) {
      axios
        .get(
          `https://api.testnet.algoexplorer.io/idx2/v2/accounts/${ctx.currentAddress}`,
        )
        .then((res) => {
          console.log(res.data.account);
          setAccountDetails(res.data.account);
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

      // AlgoSdk.getAccountDetailsIndexer(ctx.currentAddress)
      //   .then((ad) => {
      //     setAccountDetails(ad);
      //   })
      //   .catch((e) => {
      //     console.error(e);
      //   });

      // AlgoSdk.getAccountInformation(ctx.currentAddress).then(
      // 	(accountDetails) => {
      // 		console.log(accountDetails);
      // 		setAccountDetails(accountDetails);
      // 		const columns = Object.keys(accountDetails);
      // 		console.log(columns);
      // 		accountDetails["created-assets"].map((item) => {
      // 			console.log(item.index);
      // 			console.log(item.params.name, item.params.total);

      // 			axios
      // 				.get(
      // 					'https://api.testnet.algoexplorer.io/idx2/v2/assets/13672793/balances'
      // 				)
      // 				.then((res) => {
      // 					console.log(res);
      // 					const newBalances = res.data.balances.map((obj) => obj.address);
      // 					console.log(newBalances);
      // 					setAccountDetails({ balances: newBalances });
      // 				});
      // 		});
      // 	}
      // );

      // async function fetchASACreated() {
      // 	await AlgoSigner.connect();

      // 	await AlgoSigner.accounts({
      // 		ledger: ledger,
      // 	})
      // 		.then((AlgoSignerWallet) => {
      // 			console.log(JSON.stringify(AlgoSignerWallet));
      // 			setWallet(AlgoSignerWallet);
      // 			console.log(JSON.stringify(wallet));
      // 		})
      // 		.catch((e) => {
      // 			console.error(e);
      // 		});
      // }

    // fetchWallet();
    }
  }, [ctx]);
  return (
    <Layout>
      <main style={pageStyles}>
        <title>Home Page</title>
        <h1 style={headingStyles}>MFASA Overview</h1>
        { accountDetails['created-assets'] ? (
          <>
            <ASAList data={accountDetails['created-assets']} />
            <ASATransactions asaList={accountDetails['created-assets']} />
          </>
        ) : (
          <h1>Select an account or this account has not created any ASA</h1>
        )}
      </main>
    </Layout>
  );
};

export default IndexPage;
