import React from 'react';
import { Link } from 'gatsby';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTable } from 'react-table';

import { CircularProgress, Grid } from '@material-ui/core';

const ASAList = ({ data, loading }) => {
  console.log('// data ', data);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Index',
        accessor: 'index', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'params.name',
      },
      {
        Header: 'Total Supply',
        accessor: 'params.total',
      },
      {
        Header: 'Decimals',
        accessor: 'params.decimals',
      },
      {
        Header: 'Default frozen',
        accessor: (d) => d.params['default-frozen'].toString(),
      },
      {
        accessor: 'config',
        Cell: ({ cell: { value }, row: { original } }) => <Button color="secondary" variant="outlined" component={Link} to={`/app/asaconfig/${original.index}`}>config</Button>,
      },
      {
        accessor: 'manage',
        Cell: ({ cell: { value }, row: { original } }) => <Button color="primary" style={{ color: '#0398D5' }} variant="outlined" component={Link} to={`/app/asamanager/${original.index}`}>manage</Button>,
      },

      // {
      //   Header: 'Whitelisted addresses',
      //   accessor: 'whitelistedAddresses',
      // },
      // {
      //   Header: 'Addresses With Balance',
      //   accessor: 'addressedWithBalance',
      // },
      // {
      //   Header: 'Assets Frozen',
      //   accessor: 'assetsFrozen',
      // },
      // {
      //   Header: 'Assets Revoked',
      //   accessor: 'assetsRevoked',
      // },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <>
      {loading ? <CircularProgress />
        : (
          <Grid
            container
            spacing={0}
            align="center"
            justify="center"
            alignItems="center"
          >
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
          </Grid>
        )}
    </>
  );
};
export default ASAList;
