import React, { useState, useContext, useEffect } from 'react';
import { useTable } from 'react-table';
import './react-table.css';

import axios from 'axios';

const ASATransactions = ({ asaList }) => {
  console.log('ASATransactions asaList', asaList);

  const [transactions, setTransactions] = useState([]);

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
          asaTransactions.push(...res.data.transactions);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          console.log(asaTransactions);
          setTransactions(asaTransactions);
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
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                  // width: '15px',
                  // maxWidth: '30px',
                }}
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
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                    // width: '15px',
                    // maxWidth: '60px',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ASATransactions;
