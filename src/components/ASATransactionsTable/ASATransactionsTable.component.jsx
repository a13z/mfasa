import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import fromUnixTime from 'date-fns/fromUnixTime';
import { formatDistance, subDays } from 'date-fns';

import CssBaseline from '@material-ui/core/CssBaseline';
import TableContainer from '@material-ui/core/TableContainer';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CircularProgress, Grid } from '@material-ui/core';

import { useTable, useSortBy } from 'react-table';
import './react-table.css';

import AlgoSdk from '../../services/AlgoSdk';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textContainer: {
    display: 'block',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

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
        Header: 'Age',
        accessor: 'round-time',
        sortDescFirst: true,
        Cell: (cell) => {
          const fromRoundTimeToDate = fromUnixTime(cell.row.original['round-time']);
          return (
            <span>
              {' '}
              {formatDistance(fromRoundTimeToDate, new Date(), { addSuffix: true })}
            </span>
          );
        },
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
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'Age',
            desc: false,
          },
        ],
      },
    },
    useSortBy,
  );
  const classes = useStyles();

  return (
    <>
      {loading ? <CircularProgress />
        : (
          <>
            <Grid container align="center" justify="center" alignItems="center">
              <Grid item>
                <h2>Results</h2>
              </Grid>
            </Grid>
            <TableContainer className={classes.container}>
              <MaUTable style={{ width: 'auto', tableLayout: 'auto' }} className={classes.table} {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          {column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
                          </span>
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
                            <div className={classes.textContainer}>
                              {cell.render('Cell')}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </MaUTable>
            </TableContainer>
          </>
        )}
    </>
  );
};

export default ASATransactionsTable;
