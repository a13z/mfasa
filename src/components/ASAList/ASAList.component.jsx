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
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
        },
        {
        Header: 'Column 2',
        accessor: 'col2',
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
            // accountDetails['created-assets'].map(item => ({ label: item.address, value: item.address }));

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
                <p>{algoSignerContext.network}</p>
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