import React, { useState, useContext, useEffect } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CircularProgress } from '@material-ui/core';

import { useTable } from 'react-table';
import './react-table.css';

import AlgoSdk from '../../services/AlgoSdk';

const ASATransactionsTable = ({ transactions }) => {
  console.log('ASATransactionsTable: transactions', transactions);

  // const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const asaTransactions = [];

  //   Promise.all(asaList.map((asa) => AlgoSdk.indexer.lookupAssetTransactions(asa.index).do()))
  //     .then((response) => {
  //       console.log('Promise all fetching transactions for asaList');
  //       console.log(response);
  //       response.forEach((item) => {
  //         asaTransactions.push(...item.transactions);
  //       });
  //       console.log('ASATransactions: useEffect asaTransactions array:');
  //       console.log(asaTransactions);
  //       setTransactions(asaTransactions);
  //       setLoading(false);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [asaList]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Asset Id',
        accessor: 'asset-transfer-transaction.asset-id', // accessor is the "key" in the data
      },
      {
        Header: 'Tx Type',
        accessor: 'tx-type', // accessor is the "key" in the data
      },
      {
        Header: 'TxId',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'From',
        accessor: 'sender',
        width: 15,
      },
      {
        Header: 'To',
        accessor: 'asset-transfer-transaction.receiver',
        width: 15,
      },
      {
        Header: 'Amount',
        accessor: 'asset-transfer-transaction.amount',
      },
      {
        Header: 'Fee',
        accessor: 'fee',
      },
      {
        Header: 'Round',
        accessor: 'confirmed-round', // accessor is the "key" in the data
      },
      {
        Header: 'Round time',
        accessor: 'round-time',
      },
    ],
    [],
  );

  const data = React.useMemo(
    () => transactions,
    [transactions],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    pageSize,
  } = useTable({ columns, data });

  return (
    <>
      {loading ? <CircularProgress />
        : (
          <>
            <h2>Transacions results:</h2>
            <MaUTable {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        {...column.getHeaderProps()}
                      >
                        {column.render('Header')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </MaUTable>
          </>
        )}
    </>
  );
};

export default ASATransactionsTable;
