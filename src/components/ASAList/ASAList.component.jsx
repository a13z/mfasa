import React, {useState, useContext, useEffect} from 'react';
import { useTable } from 'react-table'
import { AlgoSignerContext } from "../../contexts/algosigner.context";

import ASATransactions from "../ASATransactions/ASATransactions.component";

import AlgoSdk from '../../services/AlgoSdk'
import axios from 'axios';


const ASAList = (address) => {
    const [accountDetails, setAccountDetails] = useState({});
    const [createdAssets, setCreatedAssets] = useState([]);
    const algoSignerContext = useContext(AlgoSignerContext);
    const [loading, setLoading] = useState(false);

    const data = React.useMemo(
    () => createdAssets,
    [createdAssets]
    )

    const columns = React.useMemo(
    () => [
        {
        Header: 'Index',
        accessor: 'index', // accessor is the "key" in the data
        },
        {
        Header: 'Name',
        accessor: 'params.name', // accessor is the "key" in the data
        },
        {
        Header: 'Total Balance',
        accessor: 'params.total',
        },
        {
        Header: 'Decimals',
        accessor: 'params.decimals',
        },
        {
        Header: 'Whitelisted addresses',
        accessor: 'whitelistedAddresses',
        },
        {
        Header: 'Addresses With Balance',
        accessor: 'addressedWithBalance',
        },
        {
        Header: 'Assets Frozen',
        accessor: 'assetsFrozen',
        },
        {
        Header: 'Assets Revoked',
        accessor: 'assetsRevoked',
        },
    ],
    []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })
    
    useEffect(() => {
        console.log("ASAList address param ", address);

        axios.get('https://api.testnet.algoexplorer.io/idx2/v2/accounts/' + algoSignerContext.currentAddress)
        .then((res) =>
        {
            console.log(res.data.account);
            setAccountDetails(res.data.account);
            setCreatedAssets(res.data.account['created-assets']);
        })
        .catch((e) => {
            console.error(e);
        });

        console.log(accountDetails['created-assets']);


        // if (algoSignerContext.currentAddress =! '') {
        //     AlgoSdk.getAccountDetailsIndexer(algoSignerContext.currentAddress)
        //     .then((accountDetails) => {
        //         console.log(accountDetails);
        //         setAccountDetails(accountDetails);
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //     });

        // AlgoSdk.getAccountInformation(algoSignerContext.currentAddress).then((accountDetails) => {
        //     console.log(accountDetails);
        //     setAccountDetails(accountDetails);
        //     const columns = Object.keys(accountDetails);
        //     console.log(columns);
        //     accountDetails['created-assets'].map(item => {
        //         console.log(item.index);
        //         console.log(item.params.name, item.params.total);

        //         axios.get('https://api.testnet.algoexplorer.io/idx2/v2/assets/13672793/balances')
        //         .then(res => {
        //             console.log(res);
        //             const newBalances = res.data.balances.map(obj => obj.address);
        //             console.log(newBalances);
        //             setAccountDetails({balances: newBalances});
        //         });

        //     });

        // });

        


        
        // async function fetchASACreated (){
        //     await AlgoSigner.connect();
    
        //     await AlgoSigner.accounts({
        //       ledger: ledger
        //     })
        //     .then((AlgoSignerWallet) => {
        //         console.log(JSON.stringify(AlgoSignerWallet));
        //         setWallet(AlgoSignerWallet);
        //         console.log(JSON.stringify(wallet));
        //     })
        //     .catch((e) => {
        //       console.error(e);
        //     });

        // }

        // fetchWallet();

    }, [algoSignerContext.currentAddress]);

    console.log(accountDetails['created-assets']);

    return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
                <th
                {...column.getHeaderProps()}
                style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                }}
                >
                {column.render('Header')}
                </th>
            ))}
            </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
            prepareRow(row)
            return (
            <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                return (
                    <td
                    {...cell.getCellProps()}
                    style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: 'papayawhip',
                    }}
                    >
                    {cell.render('Cell')}
                    
                    </td>
                )
                })}
            </tr>
            )
        })}
        </tbody>
    </table>
    
    )   
}

export default ASAList;