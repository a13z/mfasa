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
import { useExportData } from 'react-table-plugins';
import Papa from 'papaparse';
import XLSX from 'xlsx';
// import JsPDF from 'jspdf';
// import 'jspdf-autotable';

// import './react-table.css';

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

function getExportFileBlob({
  columns, data, fileType, fileName,
}) {
  console.log('getExportFileBlog');
  console.log(data);
  if (fileType === 'csv') {
    // CSV example
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: 'text/csv' });
  } if (fileType === 'xlsx') {
    // XLSX example

    const header = columns.map((c) => c.exportValue);
    const compatibleData = data.map((row) => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(compatibleData, {
      header,
    });
    XLSX.utils.book_append_sheet(wb, ws1, 'React Table Data');
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    // Returning false as downloading of file is already taken care of
    return false;
  }
  // PDF example
  // if (fileType === 'pdf') {
  //   const headerNames = columns.map((column) => column.exportValue);
  //   const doc = new JsPDF();
  //   doc.autoTable({
  //     head: [headerNames],
  //     body: data,
  //     margin: { top: 20 },
  //     styles: {
  //       minCellHeight: 9,
  //       halign: 'left',
  //       valign: 'center',
  //       fontSize: 11,
  //     },
  //   });
  //   doc.save(`${fileName}.pdf`);

    return false;
  }

  // Other formats goes here
  return false;
}

const ASATransactionsTable = ({ transactions, assetsCreated }) => {
  console.log('ASATransactionsTable: transactions', transactions);
  console.log(JSON.stringify(assetsCreated));

  const [loading, setLoading] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Asset Id',
        accessor: 'asset-transfer-transaction.asset-id', // accessor is the "key" in the data
        getCellExportValue: (row, column) => {
          if (row.original['asset-transfer-transaction'] !== undefined) {
            return (row.original['asset-transfer-transaction']['asset-id']);
          }
          if (row.original['asset-freeze-transaction'] !== undefined) {
            return (row.original['asset-freeze-transaction']['asset-id']);
          }
          if (row.original['asset-config-transaction'] !== undefined) {
            return (row.original['created-asset-index']);
          }
        },
        Cell: (cell) => {
          if (cell.row.original['asset-transfer-transaction'] !== undefined) {
            return (
              <span>
                {cell.row.original['asset-transfer-transaction']['asset-id']}
              </span>
            );
          }
          if (cell.row.original['asset-freeze-transaction'] !== undefined) {
            return (
              <span>
                {cell.row.original['asset-freeze-transaction']['asset-id']}
              </span>
            );
          }
          if (cell.row.original['asset-config-transaction'] !== undefined) {
            return (
              <span>
                {cell.row.original['created-asset-index'] || cell.row.original['asset-config-transaction']['asset-id']}
              </span>
            );
          }
          return (
            <span />
          );
        },
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
        getCellExportValue: (row, column) => {
          if (row.original['asset-transfer-transaction'] !== undefined) {
            const { decimals } = assetsCreated[row.original['asset-transfer-transaction']['asset-id'].toString()];
            return (row.original['asset-transfer-transaction'].amount / (10 ** decimals)).toFixed(decimals);
          }
        },
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
        Header: 'Unit Name',
        accessor: 'unit-name',
        getCellExportValue: (row, column) => {
          if (row.original['asset-transfer-transaction'] !== undefined) {
            const unitName = assetsCreated[row.original['asset-transfer-transaction']['asset-id'].toString()]['unit-name'];
            return unitName;
          }
        },
        Cell: (cell) => {
          if (cell.row.original['asset-transfer-transaction'] !== undefined) {
            const unitName = assetsCreated[cell.row.original['asset-transfer-transaction']['asset-id'].toString()]['unit-name'];
            return (
              <span>
                {unitName}
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
        getCellExportValue: (row, column) => row.original.fee / 1000000,
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
        getCellExportValue: (row, column) => {
          const fromRoundTimeToDate = fromUnixTime(row.original['round-time']);
          return format(fromRoundTimeToDate, "dd-MM-yyyy' 'HH:mm:ss");
        },
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
    getResolvedState,
    exportData,
  } = useTable(
    {
      columns,
      data,
      getExportFileBlob,
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
    useExportData,
    usePagination,
  );

  // Render the UI for your table

  const classes = useStyles();

  return (
    <>
      {loading ? <CircularProgress />
        : (
          <>
            <div>
              <button
                onClick={() => {
                  exportData('csv', true);
                }}
              >
                Export All as CSV
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  exportData('pdf', true);
                }}
              >
                Export All as PDF
              </button>
            </div>
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
