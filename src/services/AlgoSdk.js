import sdk from 'algosdk';

class AlgoSdk {
  client;

  clientV2;

  indexer;

  network;

  networks = [
    {
      name: 'testnet',
      label: 'TESTNET',
      algodServer: `${process.env.GATSBY_ALGOD_TESTNET_URL}`,
      algodPort: `${process.env.GATSBY_ALGOD_TESTNET_PORT}`,
      algodToken: `${process.env.GATSBY_ALGOD_TESTNET_TOKEN}`,
      indexerServer: `${process.env.GATSBY_INDEXER_TESTNET_URL}`,
      indexerPort: `${process.env.GATSBY_INDEXER_TESTNET_PORT}`,
      indexerToken: `${process.env.GATSBY_INDEXER_TESTNET_TOKEN}`,
    },
    {
      name: 'mainnet',
      server: 'https://mainnet-algorand.api.purestake.io/ps1',
      label: 'MAINNET',
      indexer: 'https://api.algoexplorer.io/idx2/',
    },
  ];

  constructor() {
    this.selectNetwork('testnet');
  }

  selectNetwork(name) {
    const networks = this.getNetworks();
    networks.forEach((network) => {
      if (network.name === name) {
        this.network = network;
        this.setClient(network);
        this.setClientV2(network);
        this.setIndexer(network);
      }
    });
  }

  async getAccountDetailsIndexer(address) {
    console.log(`getAccountDetailsIndexer ${address}`);
    const network = this.getCurrentNetwork();
    let accountDetails;

    axios
      .get(`${network}/v2/accounts/${address}`)
      .then((res) => {
        accountDetails = res.data.account;
        console.log(res.data.account);
      })
      .catch((e) => {
        console.error(e);
      });

    return accountDetails;
  }

  getAssetUrl(id) {
    return `${this.getExplorer()}/asset/${id}`;
  }

  getCurrentNetwork() {
    return this.network;
  }

  setClient(network) {
    console.log(network);
    this.client = new sdk.Algod(network.algodToken, network.algodServer, network.algodPort);
    console.log(this.client);
  }

  setClientV2(network) {
    console.log(network);
    this.clientV2 = new sdk.Algodv2(network.algodToken, network.algodServer, network.algodPort);
    console.log(this.clientV2);
  }

  setIndexer(network) {
    this.indexer = new sdk.Indexer(network.indexerToken, network.indexerServer, network.indexerPort);
  }

  getClient() {
    return this.client;
  }

  getClientV2() {
    return this.clientV2;
  }

  getIndexer() {
    return this.indexer;
  }

  mnemonicToSecretKey(mnemonic) {
    return sdk.mnemonicToSecretKey(mnemonic);
  }

  async getAccountInformation(address) {
    console.log('getAccountInformation');
    return await this.getClientV2().accountInformation(address).do();
  }

  async getAssetInformation(assetID) {
    console.log('getAssetInformation');
    return this.getClient().assetInformation(assetID);
  }

  async getSuggestedTxParams() {
    const params = {
      fee: 0,
      firstRound: 0,
      lastRound: 0,
      genesisID: '',
      genesisHash: '',
    };

    const txParams = await this.getClientV2().getTransactionParams().do();
    console.log('Algorand suggested tx parameters: %o', params);

    params.firstRound = txParams.firstRound;
    params.lastRound = txParams.lastRound;
    params.fee = txParams.fee;
    params.genesisID = txParams.genesisID;
    params.genesisHash = txParams.genesisHash;

    return params;
  }

  // Function used to wait for a tx confirmation
  async waitForConfirmation(txId) {
    const response = await this.getClientV2().status().do();
    let lastround = response['last-round'];
    let confirmedRound;
    while (true) {
      const pendingInfo = await this.getClientV2().pendingTransactionInformation(txId).do();
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        // Got the completed Transaction
        confirmedRound = pendingInfo['confirmed-round'];
        console.log(`Transaction ${txId} confirmed in round ${pendingInfo['confirmed-round']}`);
        break;
      }
      lastround++;
      await this.getClientV2().statusAfterBlock(lastround).do();
    }
    return confirmedRound;
  }

  // Function used to print created asset for account and assetid
  async printCreatedAsset(account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    const accountInfo = await this.getClientV2().accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
      const scrutinizedAsset = accountInfo['created-assets'][idx];
      if (scrutinizedAsset.index == assetid) {
        console.log(`AssetID = ${scrutinizedAsset.index}`);
        const myparms = JSON.stringify(scrutinizedAsset.params, undefined, 2);
        console.log(`parms = ${myparms}`);
        break;
      }
    }
  }

  // Function used to print asset holding for account and assetid
  async printAssetHolding(account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    const accountInfo = await this.getClientV2().accountInformation(account).do();
    for (let idx = 0; idx < accountInfo.assets.length; idx++) {
      const scrutinizedAsset = accountInfo.assets[idx];
      if (scrutinizedAsset['asset-id'] == assetid) {
        const myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
        console.log(`assetholdinginfo = ${myassetholding}`);
        break;
      }
    }
  }

  async sendTransaction(rawSignedTxn) {
    // Algosigner NOTE: Due to limitations in Chrome internal messaging, AlgoSigner
    // encodes the transaction blob in base64 strings.
    // This is why we have to decode and encode before sendRawTransaction
    const rawSignedTxnD = sdk.decodeObj(new Uint8Array(Buffer.from(rawSignedTxn, 'base64')));

    console.log('Algosigner Txn decoded');
    console.log(rawSignedTxnD);

    const rawSignedTxnE = sdk.encodeObj(rawSignedTxnD);

    console.log('Txn encoded with Algosdk');
    console.log(rawSignedTxnE);

    try {
      const transaction = await this.getClientV2().sendRawTransaction(rawSignedTxnE).do();
      console.log(transaction);
      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  async createAlgoSignerTransaction(type, from, to, amount, note, assetIndex) {
    const params = await this.getSuggestedTxParams();

    const assetRevocationTarget = undefined;
    const closeRemainderTo = undefined;

    const transaction = {
      type: undefined,
      from,
      note,
      fee: params.fee,
      // flatFee: true,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      assetRevocationTarget,
      closeRemainderTo,
    };

    switch (type) {
      case 'config':
        transaction.type = 'acfg';
        transaction.to = to;
        break;
      case 'send':
        transaction.type = 'axfer';
        transaction.to = to;
        transaction.amount = amount;
        transaction.assetIndex = assetIndex;
        break;
      case 'freeze':
        transaction.type = 'afrz';
        delete transaction.to;
        transaction.freezeAccount = to;
        transaction.assetIndex = assetIndex;
        transaction.freezeState = true;
        break;
      case 'unfreeze':
        transaction.type = 'afrz';
        delete transaction.to;
        transaction.freezeAccount = to;
        transaction.assetIndex = assetIndex;
        transaction.freezeState = false;
        break;
      case 'revoke':
        transaction.type = 'axfer';
        transaction.to = to;
        transaction.amount = amount;
        transaction.assetIndex = assetIndex;
        transaction.assetRevocationTarget = to;
        break;
      default:
        console.log('createAlgoSignerTransaction function: missing transaction type');
        break;
    }
    console.log('createAlgoSignerTransaction function: Transaction created');
    console.log(transaction);
    return transaction;
  }

  async createAssetTxn(
    sender,
    assetName,
    assetUnitName,
    assetTotal,
    assetDecimals,
    assetURL,
    assetMetadataHash,
    assetDefaultFrozen,
    assetManager,
    assetReserve,
    assetFreeze,
    assetClawback,
  ) {
    const params = await this.getSuggestedTxParams();

    // const note = new Uint8Array(Buffer.from('MFASA', 'base64'));
    const note = sdk.encodeObj('MFASA');

    if (assetDecimals === undefined || assetDecimals === null || assetDecimals === '') {
      assetDecimals = 0;
    }

    const txn = {
      from: sender,
      assetName,
      assetUnitName,
      assetTotal,
      assetDecimals,
      // note,
      type: 'acfg',
      fee: params.fee,
      // fee: 1000,
      // flatFee: true,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      assetURL,
      // assetMetadataHash,
      assetDefaultFrozen,
      assetManager,
      assetReserve,
      assetFreeze,
      assetClawback,
    };

    console.log('CreateAssetTxn: ');
    console.log(txn);

    // NOTE: Using algosdk method Algosigner doesn't sign it
    const txnd = sdk.makeAssetCreateTxnWithSuggestedParams(
      sender,
      note,
      assetTotal,
      assetDecimals,
      assetDefaultFrozen,
      assetManager,
      assetReserve,
      assetFreeze,
      assetClawback,
      assetName,
      assetUnitName,
      assetURL,
      assetMetadataHash,
      params,
    );
    console.log('Create Transaction with js sdk ');
    console.log(txnd);
    return txn;
  }

  async modifyAsset(
    wallet,
    assetId,
    managerAddress,
    reserveAddress,
    freezeAddress,
    clawbackAddress,
  ) {
    const cp = await this.getChangingParams();

    const note = new Uint8Array(Buffer.from('MFASA', 'base64'));
    const addr = wallet.address;
    let txn;
    try {
      txn = sdk.makeAssetConfigTxn(
        addr,
        cp.fee,
        cp.firstRound,
        cp.lastRound,
        note,
        cp.genHash,
        cp.genID,
        assetId,
        managerAddress,
        reserveAddress,
        freezeAddress,
        clawbackAddress,
      );
    } catch (e) {
      console.log(e);
    }

    const rawSignedTxn = txn.signTxn(wallet.secretKey);

    const transaction = await this.getClientV2().sendRawTransaction(rawSignedTxn, {
      'Content-Type': 'application/x-binary',
    });
    return transaction;
  }

  async pendingTransactionInformation(txId) {
    return await this.getClient().pendingTransactionInformation(txId);
  }

  async destroyAsset(wallet, assetId) {
    const cp = await this.getChangingParams();
    const addr = wallet.address;
    const note = new Uint8Array(Buffer.from('MFASA', 'base64'));

    const txn = sdk.makeAssetDestroyTxn(
      addr,
      cp.fee,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId,
    );
    const rawSignedTxn = txn.signTxn(wallet.secretKey);

    const transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      'Content-Type': 'application/x-binary',
    });
    return transaction;
  }

  async freezeAsset(wallet, assetId, freezeAddress, freezeState) {
    const cp = await this.getChangingParams();
    const addr = wallet.address;
    const note = new Uint8Array(Buffer.from('MFASA', 'base64'));
    if (!freezeState) {
      freezeState = false;
    }

    const txn = sdk.makeAssetFreezeTxn(
      addr,
      cp.fee,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId,
      freezeAddress,
      freezeState,
    );

    const rawSignedTxn = txn.signTxn(wallet.secretKey);

    const transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      'Content-Type': 'application/x-binary',
    });
    return transaction;
  }

  async sendAssets(sender, assetId, recipient, amount) {
    const params = await this.getSuggestedTxParams();

    const note = 'MFASA';
    const assetRevocationTarget = undefined;
    const closeRemainderTo = undefined;

    const transaction = {
      from: sender,
      to: recipient,
      assetIndex: assetId,
      amount,
      note,
      type: 'axfer',
      fee: params.fee,
      // flatFee: true,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      assetRevocationTarget,
      closeRemainderTo,
    };

    // AlgoSigner doesn't like this approach
    // const transaction = sdk.makeAssetTransferTxnWithSuggestedParams(
    //   sender,
    //   recipient,
    //   closeRemainderTo,
    //   revocationTarget,
    //   amount,
    //   note,
    //   assetId,
    //   params,
    // );

    // name,tag,appArgs.
    // transaction.from = sender;
    // transaction.to = recipient;
    // delete transaction.name;
    // delete transaction.tag;
    // delete transaction.appArgs;
    return transaction;
  }

  async revokeAssets(
    wallet,
    assetId,
    revokeAddress,
    revokeReceiverAddress,
    revokeAmount,
  ) {
    const cp = await this.getChangingParams();

    const note = new Uint8Array(Buffer.from('MFASA', 'base64'));
    const sender = wallet.address;
    const revocationTarget = revokeAddress;
    const closeRemainderTo = undefined;

    const txn = sdk.makeAssetTransferTxn(
      sender,
      revokeReceiverAddress,
      closeRemainderTo,
      revocationTarget,
      cp.fee,
      revokeAmount,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId,
    );

    const rawSignedTxn = txn.signTxn(wallet.secretKey);

    const transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      'Content-Type': 'application/x-binary',
    });
    return transaction;
  }

  isValidAddress(addr) {
    return sdk.isValidAddress(addr);
  }

  getNetworks() {
    return this.networks;
  }
}

export default new AlgoSdk();
