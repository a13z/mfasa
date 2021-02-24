import React, { useEffect, useState } from 'react';

import { useTable } from 'react-table';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const ReportsTable = ({ columns, data }) => {
    
    const data = React.useMemo(() => transactions, [transactions]);

const columns = React.useMemo(
  () => [
    {
      Header: 'Asset Id',
      accessor: 'asset-transfer-transaction.asset-id', // accessor is the "key" in the data
      width: 15,
    },
    {
      Header: 'TxId',
      accessor: 'id', // accessor is the "key" in the data
      width: 15,
    },
    {
      Header: 'Round',
      accessor: 'confirmed-round', // accessor is the "key" in the data
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
      Header: 'Round time',
      accessor: 'round-time',
    },
  ],
  [],
);

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
  });
  /*
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
				  prepareRow(row);
				  return (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => (
      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
    ))}
  </tr>
				  );
        })}
      </tbody>
    </table>
  );
};

export default ReportsTable;
