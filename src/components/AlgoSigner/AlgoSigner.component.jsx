import React, {useState, useContext, useEffect} from 'react';
import Select from "react-select";
import { AlgoSignerContext } from '../../contexts/algosigner.context';

const networkOptions = [
    { value: 'TestNet', label: 'TestNet' },
    { value: 'MainNet', label: 'MainNet' },
]

const Ledger = (handleChange) => (
    <Select 
        options={networkOptions} 
        defaultValue={networkOptions[0]} 
        onChange={handleChange}
    />
)

const Addresses = ({wallet, handleChange}) => {
    console.log(wallet);
    const addressesOptions = wallet.map(item => ({ label: item.address, value: item.address }));
    
    console.log(addressesOptions);
    return (
        <Select options={addressesOptions} 
                defaultValue={addressesOptions[0]} 
                onChange={handleChange}
        />
    )
}

const AlgoSigner = (props) => {

    // const {currentAddressCxt, ledgerCxt, walletCxt} = React.useContext(AlgoSignerContext);

    const [currentAddress, setCurrentAddress] = useState("");
    const [ledger, setLedger] = useState('TestNet')
    const [wallet, setWallet] = useState([]);

    const addressOptions = wallet.map(item => ({ label: item.address, value: item.address }));

    const handleLedgerChange = (event) => {
        console.log(event.value);
        setLedger(event.value);
    }

    const handleAddressChange = (event) => {
        console.log(event.value);
        setCurrentAddress(event.value);
    }

    useEffect(() => {
        const AlgoSigner = window.AlgoSigner;

        if (!AlgoSigner) {
          alert('Sorry, no AlgoSigner detected.');
          return;
        }
        async function fetchWallet (){
            await AlgoSigner.connect();
    
            await AlgoSigner.accounts({
              ledger: ledger
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
        <AlgoSignerContext.Provider value={{currentAddress,
            ledger,
            wallet}}>
            
            {/* TODO This doesn't work and don't know why  */}
            {/* <Ledger ledger={ledger} onChange={handleChange}/> */}
            {/* <Addresses wallet={wallet} onChange={handleChange}/> */}

            <Select
                inputId={"network"}
                placeholder='Network'
                options={networkOptions}
                default={ledger}
                onChange={handleLedgerChange}
            />
            <Select 
                inputId={"address"}
                placeholder='Address'
                options={addressOptions} 
                defaultValue={currentAddress} 
                onChange={handleAddressChange}
            />

            <p>Current selected network: <b>{ledger}</b></p>
            <p>Current selected address: <b>{currentAddress}</b></p>

            
            {props.children}
        </AlgoSignerContext.Provider>
    );
      
}
export default AlgoSigner;
