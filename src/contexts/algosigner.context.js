import { createContext } from 'react';

const AlgoSignerContext = createContext({
    currentAddress: null,
    network: null,
    wallet: [],
  });

const AlgoSignerConsumer = AlgoSignerContext.Consumer;

export { AlgoSignerConsumer };
export { AlgoSignerContext };
