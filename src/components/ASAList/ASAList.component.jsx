import React from 'react';
import { Link } from 'gatsby';

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
        accessor: 'manage',
        Cell: ({ cell: { value }, row: { original } }) => <Link to={`asamanager/${original.index}`}>manage</Link>,
      },
      // {
      //   Header: 'Decimals',
      //   accessor: 'params.decimals',
      // },
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
          </Grid>
        )}
    </>
  );
};
export default ASAList;
