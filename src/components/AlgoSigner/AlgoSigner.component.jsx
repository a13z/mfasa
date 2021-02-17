import React, {
  useState, useContext, useEffect, createContext,
} from 'react';
import Select from 'react-select';
import AlgoSignerContext from '../../contexts/algosigner.context';

const networkOptions = [
  { id: 1, value: 'TestNet', label: 'TestNet' },
  { id: 2, value: 'MainNet', label: 'MainNet' },
];

const Ledger = (handleChange) => (
  <Select
    options={networkOptions}
    defaultValue={networkOptions[0]}
    onChange={handleChange}
  />
);

const Addresses = ({ wallet, handleChange }) => {
  console.log(wallet);
  const addressesOptions = wallet.map((item) => ({
    label: item.address,
    value: item.address,
  }));

  console.log(addressesOptions);
  return (
    <Select
      options={addressesOptions}
      defaultValue={addressesOptions[0]}
      onChange={handleChange}
    />
  );
};

const AlgoSigner = (props) => {
  // const {currentAddressCxt, ledgerCxt, walletCxt} = React.useContext(AlgoSignerContext);

  const [currentAddress, setCurrentAddress] = useState('');
  const [ledger, setLedger] = useState('');
  const [wallet, setWallet] = useState([]);

  const handleLedgerChange = (event) => {
    console.log(event.target.value);
    setLedger(event.target.value);
  };

  const handleAddressChange = (event) => {
    console.log(event.target.value);
    setCurrentAddress(event.target.value);
  };

  useEffect(() => {
    const { AlgoSigner } = window;

    if (!AlgoSigner) {
      alert('Sorry, no AlgoSigner detected.');
      return;
    }
    async function fetchWallet() {
      await AlgoSigner.connect();

      await AlgoSigner.accounts({
        ledger,
      })
        .then((AlgoSignerWallet) => {
          console.log(JSON.stringify(AlgoSignerWallet));
          setWallet(AlgoSignerWallet);
          console.log(JSON.stringify(wallet));
        })
        .catch((e) => {
          console.error(e);
        });
    }

    fetchWallet();
  }, [ledger]);

  return (
    <AlgoSignerContext.Provider
      value={{
        currentAddress,
        ledger,
        wallet,
      }}
    >
      {/* TODO This doesn't work and don't know why  */}
      {/* <Ledger ledger={ledger} onChange={handleChange}/> */}
      {/* <Addresses wallet={wallet} onChange={handleChange}/> */}

      {/* <Select
        inputId="network"
        placeholder="Network"
        options={networkOptions}
        default={ledger}
        onChange={handleLedgerChange}
      /> */}
      <select name="network" id="network" onChange={handleLedgerChange}>
        <option value="">Select a network</option>
        {networkOptions.map((n) => (
          <option id={n.id} value={n.value}>
            {n.label}
          </option>
        ))}
      </select>
      <p>
        Current selected network:
        <b>{ledger}</b>
      </p>

      {/* <Select
        inputId="address"
        placeholder="Address"
        options={addressOptions}
        defaultValue={currentAddress}
        onChange={handleAddressChange}
      /> */}
      {ledger && (
      <div>

        <select name="address" id="address" onChange={handleAddressChange}>
          <option value="">Select an address</option>
          {wallet.map((item) => (
            <option value={item.address}>{item.address}</option>
          ))}
        </select>
        <p>
          Current selected address:
          <b>{currentAddress}</b>
        </p>
      </div>
      )}

      {props.children}
    </AlgoSignerContext.Provider>
  );
};
export default AlgoSigner;
