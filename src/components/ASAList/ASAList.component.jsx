import React, {useState, useContext, useEffect} from 'react';
import { useTable } from 'react-table'
import { AlgoSignerContext } from "../../contexts/algosigner.context";

import AlgoSdk from '../../services/AlgoSdk'
import axios from 'axios';

const ASAList = (address) => {
    const [accountDetails, setAccountDetails] = useState({})
    const algoSignerContext = useContext(AlgoSignerContext);

    const data = React.useMemo(
    () => [
        {
        col1: 'Hello',
        col2: 'World',
        },
        {
        col1: 'react-table',
        col2: 'rocks',
        },
        {
        col1: 'whatever',
        col2: 'you want',
        },
    ],
    []
    )

    const columns = React.useMemo(
    () => [
        {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
        },
        {
        Header: 'Total Balance',
        accessor: 'totalBalance',
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

        // axios.get('https://www.reddit.com/r/reactjs.json')
        // .then(res => {
        //     const newPosts = res.data.data.children
        //     .map(obj => obj.data);
        //     setPosts(newPosts);
        // });

        AlgoSdk.getAccountInformation(algoSignerContext.currentAddress).then((accountDetails) => {
            console.log(accountDetails);
            setAccountDetails(accountDetails);
            const columns = Object.keys(accountDetails);
            console.log(columns);
            accountDetails['created-assets'].map(item => {
                console.log(item.index);
                console.log(item.params.name, item.params.total)
            });

        });

        
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
                    {accountDetails.amount}
                    
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