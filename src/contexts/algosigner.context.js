import React from 'react';

const AlgoSignerContext = React.createContext({
    currentAddress: '',
    network: 'Testnet',
    wallet: [],
    accountDetails: {},
  });

const AlgoSignerConsumer = AlgoSignerContext.Consumer;

export { AlgoSignerConsumer };
export { AlgoSignerContext };
