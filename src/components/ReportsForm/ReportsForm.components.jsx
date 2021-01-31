import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTable } from 'react-table';

import axios from 'axios';

function Table({ columns, data }) {
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
}

export default function ReportsForm() {
  const { register, handleSubmit, errors } = useForm();
  const [transactions, setTransactions] = useState([]);
  const onSubmit = (data) => {
    fetchTransactions(data.asaId);
    console.log(data);
  };

  console.log(errors);

  const fetchTransactions = (asaId = '13672793') => {
    console.log(asaId);
    axios
      .get(
        `https://api.testnet.algoexplorer.io/idx2/v2/assets/${asaId}/transactions?limit=10`,
      )
      .then((response) => {
        console.log(response.data.transactions);
        setTransactions(response.data.transactions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="datetime" placeholder="From" name="From" ref={register} />
        <input type="datetime" placeholder="To" name="To" ref={register} />
        <input type="text" placeholder="asaId" name="asaId" ref={register} />
        <select name="ASA" ref={register}>
          <option value="All">All</option>
        </select>
        <select name="Tx Type" ref={register}>
          <option value="All">All</option>
          <option value="Payment">Payment</option>
          <option value="Key Registration">Key Registration</option>
          <option value="Asset Configuration">Asset Configuration</option>
          <option value="Asset Freeze">Asset Freeze</option>
          <option value="Asset Transfer">Asset Transfer</option>
        </select>
        <input
          type="text"
          placeholder="Account"
          name="Account"
          ref={register({ maxLength: 52 })}
        />
        <input
          type="number"
          placeholder="Balance min"
          name="Balance min"
          ref={register}
        />
        <input
          type="number"
          placeholder="Balance max"
          name="Balance max"
          ref={register}
        />

        <input type="submit" />
      </form>

      <Table columns={columns} data={data} />
    </>
  );
}
