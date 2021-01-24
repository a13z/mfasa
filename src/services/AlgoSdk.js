import sdk from 'algosdk';

// const token = "<your-api-token>";
// const server = "<http://your-sever>";
// const port = 8080;

// sandbox
const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const sandboxServer = "http://localhost";
const port = 4001;

// const token = {
//     'X-API-Key': '<PureStake API Key>'
// };

class AlgoSdk {

    client;
    network;
    networks = [{
        name: 'testnet',
        server: sandboxServer,
        label: 'TESTNET',
        explorer: 'https://goalseeker.purestake.io/algorand/testnet'
    }, {
        name: 'mainnet',
        server: 'https://mainnet-algorand.api.purestake.io/ps1',
        label: 'MAINNET',
        explorer: 'https://goalseeker.purestake.io/algorand/mainnet'
    }];

    constructor() {
        this.selectNetwork('testnet');
    }

    selectNetwork(name) {
        const networks = this.getNetworks();
        networks.forEach((network) => {
            if (network.name === name) {
                this.network = network;
                this.setClient(network.server);
            }
        })
    }

    getExplorer() {
        const network = this.getCurrentNetwork();
        return this.network.explorer;
    }

    getAssetUrl(id) {
       return this.getExplorer() + '/asset/' + id;
    }

    getCurrentNetwork() {
        return this.network;
    }

    setClient(server) {
        // this.client = new sdk.Algod(token, server, port);
        this.client = new sdk.Algodv2(token, server, port);
    }

    getClient() {
        return this.client;
    }

    mnemonicToSecretKey(mnemonic) {
        return sdk.mnemonicToSecretKey(mnemonic);
    }

    async getAccountInformation(address) {
        return await this.getClient().accountInformation(address);
    }

    async getAssetInformation(assetID) {
        return  await this.getClient().assetInformation(assetID);
    }

    async getChangingParams() {
        const cp = {
            fee: 0,
            firstRound: 0,
            lastRound: 0,
            genID: "",
            genHash: ""
        };

        let params = await this.getClient().getTransactionParams();
        cp.firstRound = params.lastRound;
        cp.lastRound = params.lastRound + parseInt(1000);
        let sFee = await this.getClient().suggestedFee();
        cp.fee = sFee.fee;
        cp.genID = params.genesisID;
        cp.genHash = params.genesishashb64;

        return cp;
    }

    async waitForConfirmation(txId) {
        let lastRound = (await this.getClient().status()).lastRound;
        while (true) {
            const pendingInfo = await this.getClient().pendingTransactionInformation(txId);
            if (pendingInfo.round !== null && pendingInfo.round > 0) {
                //Got the completed Transaction
                console.log("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
                break;
            }
            lastRound++;
            await this.getClient().statusAfterBlock(lastRound);
        }
    };

    // Function used to wait for a tx confirmation
    async waitForConfirmationV2(txId) {
        let response = await this.status().do();
        let lastround = response["last-round"];
        while (true) {
            const pendingInfo = await this.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
            }
            lastround++;
            await sdk.statusAfterBlock(lastround).do();
        }
    };

    async sendTransaction(rawSignedTxn) {
        let rawSignedTxnD = sdk.decodeObj(new Uint8Array(Buffer.from(rawSignedTxn, "base64")));
        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxnD));
        return transaction;
    };
    
    async createAssetOld(wallet, assetName, unitName, supply, assetURL, managerAddress, reserveAddress, freezeAddress, clawbackAddress, decimals) {
        let cp = await this.getChangingParams();

        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        let addr = wallet;
        let defaultFrozen = false;

        if (decimals === undefined || decimals === null || decimals === "") {
            decimals = 0;
        }
        const txn = sdk.makeAssetCreateTxn(addr, cp.fee, cp.firstRound, cp.lastRound, note,
            cp.genHash, cp.genID, supply, decimals, defaultFrozen, managerAddress, reserveAddress, freezeAddress, clawbackAddress,
            unitName, assetName, assetURL);


        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return transaction;
    }

    async createAsset(wallet, assetName, unitName, supply, assetURL, managerAddress, reserveAddress, freezeAddress, clawbackAddress, decimals) {
        let cp = await this.getChangingParams();

        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        let addr = wallet;
        let defaultFrozen = false;

        if (decimals === undefined || decimals === null || decimals === "") {
            decimals = 0;
        }
        const txn = sdk.makeAssetCreateTxn(addr, cp.fee, cp.firstRound, cp.lastRound, note,
            cp.genHash, cp.genID, supply, decimals, defaultFrozen, managerAddress, reserveAddress, freezeAddress, clawbackAddress,
            unitName, assetName, assetURL);


        // let rawSignedTxn = txn.signTxn(wallet.secretKey);

        // let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return txn;
    }

    async modifyAsset(wallet, assetId, managerAddress, reserveAddress, freezeAddress, clawbackAddress) {
        let cp = await this.getChangingParams();

        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        let addr = wallet.address;
        let txn;
        try {
            txn = sdk.makeAssetConfigTxn(addr, cp.fee, cp.firstRound, cp.lastRound, note,
                cp.genHash, cp.genID, assetId, managerAddress, reserveAddress, freezeAddress, clawbackAddress);
        }
        catch (e) {
            console.log(e);
        }

        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return transaction;
    }

    async pendingTransactionInformation(txId) {
        return await this.getClient().pendingTransactionInformation(txId);
    }

    async destroyAsset(wallet, assetId) {
        let cp = await this.getChangingParams();
        const addr = wallet.address;
        let note = new Uint8Array(Buffer.from("MFASA", "base64"));

        let txn = sdk.makeAssetDestroyTxn(addr, cp.fee,
            cp.firstRound, cp.lastRound, note, cp.genHash,
            cp.genID, assetId);
        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return transaction;
    }

    async freezeAsset(wallet, assetId, freezeAddress, freezeState) {
        let cp = await this.getChangingParams();
        const addr = wallet.address;
        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        if (!freezeState) {
            freezeState = false;
        }

        let txn = sdk.makeAssetFreezeTxn(addr, cp.fee,
            cp.firstRound, cp.lastRound, note, cp.genHash, cp.genID,
            assetId, freezeAddress, freezeState);

        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return transaction;
    }

    async sendAssets(wallet, assetId, recipient, amount) {
        let cp = await this.getChangingParams();

        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        let sender = wallet.address;
        const revocationTarget = undefined;
        const closeRemainderTo = undefined;

        const txn = sdk.makeAssetTransferTxn(sender, recipient,
            closeRemainderTo, revocationTarget,cp.fee, amount,
            cp.firstRound, cp.lastRound, note, cp.genHash, cp.genID, assetId);

        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
        return transaction;
    }

    async revokeAssets(wallet, assetId, revokeAddress, revokeReceiverAddress, revokeAmount) {
        let cp = await this.getChangingParams();

        let note = new Uint8Array(Buffer.from("MFASA", "base64"));
        let sender = wallet.address;
        const revocationTarget = revokeAddress;
        const closeRemainderTo = undefined;

        const txn = sdk.makeAssetTransferTxn(sender,
            revokeReceiverAddress, closeRemainderTo, revocationTarget,
            cp.fee, revokeAmount, cp.firstRound, cp.lastRound,
            note, cp.genHash, cp.genID, assetId);

        let rawSignedTxn = txn.signTxn(wallet.secretKey);

        let transaction = (await this.getClient().sendRawTransaction(rawSignedTxn, {'Content-Type': 'application/x-binary'}));
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