import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import fromUnixTime from 'date-fns/fromUnixTime';
import { formatDistance, subDays, format } from 'date-fns';

import CssBaseline from '@material-ui/core/CssBaseline';
import TableContainer from '@material-ui/core/TableContainer';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CircularProgress, Grid } from '@material-ui/core';

import { useTable, useSortBy, usePagination } from 'react-table';
import './react-table.css';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
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

const ASATransactionsTable = ({ transactions, assetsCreated }) => {
  console.log('ASATransactionsTable: transactions', transactions);
  console.log(JSON.stringify(assetsCreated));

  const [loading, setLoading] = useState(false);

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
        Cell: (cell) => {
          if (cell.row.original['asset-transfer-transaction'] !== undefined) {
            const { decimals } = assetsCreated[cell.row.original['asset-transfer-transaction']['asset-id'].toString()];
            return (
              <span>
                {(cell.row.original['asset-transfer-transaction'].amount / (10 ** decimals)).toFixed(decimals)}
              </span>
            );
          }
          return (
            <span />
          );
        },
      },
      {
        Header: 'Fee (Algos)',
        accessor: 'fee',
        Cell: (cell) => (
          <span>
            {cell.row.original.fee / 1000000}
          </span>
        ),
      },
      {
        Header: 'Round',
        accessor: 'confirmed-round',
        sortDescFirst: true,
      },
      {
        Header: 'Date/Time (UTC)',
        accessor: 'round-time',
        Cell: (cell) => {
          const fromRoundTimeToDate = fromUnixTime(cell.row.original['round-time']);
          return (
            <span>
              {format(fromRoundTimeToDate, "dd-MM-yyyy' 'HH:mm:ss")}
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
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: 'confirmed-round',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    usePagination,
  );

  // Render the UI for your table

  const classes = useStyles();

  return (
    <>
      {loading ? <CircularProgress />
        : (
          <>
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
                  {page.map((row, i) => {
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
            <div className="pagination">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
              </button>
              {' '}
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
              </button>
              {' '}
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </button>
              {' '}
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
              </button>
              {' '}
              <span>
                Page
                {' '}
                <strong>
                  {pageIndex + 1}
                  {' '}
                  of
                  {pageOptions.length}
                </strong>
                {' '}
              </span>
              <span>
                | Go to page:
                {' '}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                  }}
                  style={{ width: '100px' }}
                />
              </span>
              {' '}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show
                    {' '}
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
    </>
  );
};

export default ASATransactionsTable;
