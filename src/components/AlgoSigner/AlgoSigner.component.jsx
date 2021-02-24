import React, {
  useState, useContext, useEffect, createContext,
} from 'react';
// import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import AlgoSignerContext from '../../contexts/algosigner.context';

const networkOptions = [
  { id: 1, value: 'TestNet', label: 'TestNet' },
  { id: 2, value: 'MainNet', label: 'MainNet' },
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AlgoSigner = (props) => {
  // const {currentAddressCxt, ledgerCxt, walletCxt} = React.useContext(AlgoSignerContext);
  const classes = useStyles();

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
      <select name="network" id="network" onChange={handleLedgerChange}>
        <option value="">Select a network</option>
        {networkOptions.map((n) => (
          <option key={n.id} id={n.id} value={n.value}>
            {n.label}
          </option>
        ))}
      </select>
      {ledger && (
      <div>
        <select name="address" id="address" onChange={handleAddressChange}>
          <option value="">Select an address</option>
          {wallet.map((item) => (
            <option key={item.address} value={item.address}>{item.address}</option>
          ))}
        </select>
        <div>
          Current selected network:
          {' '}
          <b>{ledger}</b>
          {' '}
          Current selected address:
          {' '}
          <b>{currentAddress}</b>
        </div>
      </div>
      )}

      {props.children}
    </AlgoSignerContext.Provider>
  );
};
export default AlgoSigner;
