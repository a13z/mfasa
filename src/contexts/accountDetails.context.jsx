import { createContext } from 'react';

const AccountDetailsContext = createContext({});

const AccountDetailsConsumer = AccountDetailsContext.Consumer;

export { AccountDetailsConsumer };
export { AccountDetailsContext };
