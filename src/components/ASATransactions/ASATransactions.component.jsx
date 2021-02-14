import React, { useState, useContext, useEffect } from 'react';

import { CircularProgress } from '@material-ui/core';

import { useTable } from 'react-table';
import './react-table.css';

import axios from 'axios';

const ASATransactions = ({ asaList }) => {
  console.log('ASATransactions asaList', asaList);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const asaTransactions = [];
    console.log('asaList useEffect', asaList);
    asaList.map((asa) => {
      const asaId = asa.index;
      console.log(`asaId ${asaId}`);
      axios
        .get(
          `https://api.testnet.algoexplorer.io/idx2/v2/assets/${asaId}/transactions`,
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          asaTransactions.push(...res.data.transactions);
          setTransactions(asaTransactions);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
          console.log(asaTransactions);
        });
    });
  }, []);

  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'Asset Id',
      //   accessor: 'asset-transfer-transaction.asset-id', // accessor is the "key" in the data
      // },
      {
        Header: 'TxId',
        accessor: 'id', // accessor is the "key" in the data
        width: 15,
      },
      // {
      //   Header: 'Round',
      //   accessor: 'confirmed-round', // accessor is the "key" in the data
      // },
      // {
      //   Header: 'From',
      //   accessor: 'sender',
      //   width: 15,
      // },
      // {
      //   Header: 'To',
      //   accessor: 'asset-transfer-transaction.receiver',
      //   width: 15,
      // },
      // {
      //   Header: 'Amount',
      //   accessor: 'asset-transfer-transaction.amount',
      // },
      // {
      //   Header: 'Fee',
      //   accessor: 'fee',
      // },
      // {
      //   Header: 'Round time',
      //   accessor: 'round-time',
      // },
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
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </>
  );
};

export default ASATransactions;
