import { Fragment, useEffect, useMemo } from 'react';

// material-ui
import { Box, CircularProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// third-party
import {
  useColumnOrder,
  useExpanded,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table';

// project import
import { DownOutlined, GroupOutlined, RightOutlined, UngroupOutlined } from '@ant-design/icons';
import { DefaultColumnFilter, renderFilterTypes } from 'components/@extended/Table/ReactTableFilter';
import { HeaderSort, ServerTablePagination, TablePagination } from 'components/@extended/Table/ReactTableHeader';
import { find } from 'lodash';

export default function CjReactTable({
  columns,
  data,
  globalFilter = null,
  sortBy = null,
  hiddenColumns = [],
  groupBy = [],
  expanded = {},
  onInitTable = null,
  isLoading = false,
  hidePagination = false,
  serverPagination = false,
  paginationProps = null,
  manualSortBy = false,
  onChangeSortBy = () => { },
  onRowClick,
  onColumnClick
}) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const theme = useTheme();
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const isFilterTable = find(columns, (column) => column.filter);
  const getHeaderProps = (column) => column.getSortByToggleProps();
  const defaultPageSize = serverPagination ? 100 : 25;
  const initialState = useMemo(
    () => ({
      hiddenColumns: hiddenColumns,
      groupBy: groupBy,
      pageIndex: 0,
      pageSize: hidePagination && data.length ? data.length : defaultPageSize,
      expanded: expanded,
      disableSortRemove: true,
      sortBy: sortBy ? sortBy : []
    }),
    [hiddenColumns]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy: _sortBy },
    setGlobalFilter,
    setSortBy,
    setGroupBy,
  } = useTable(
    {
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          const rowOneColumn = row1.values[columnName];
          const rowTwoColumn = row2.values[columnName];
          if (isNaN(rowOneColumn)) {
            return rowOneColumn.toUpperCase() > rowTwoColumn.toUpperCase() ? 1 : -1;
          }
          return Number(rowOneColumn) > Number(rowTwoColumn) ? 1 : -1;
        }
      },
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState,
      manualSortBy
    },
    useGlobalFilter,
    useFilters,
    useColumnOrder,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (manualSortBy) {
      onChangeSortBy(_sortBy);
    }
  }, [_sortBy]);

  useEffect(() => {
    if (!_.isEmpty(groupBy)) {
      setGroupBy(groupBy);
    }
  }, [groupBy]);

  useEffect(() => {
    setGlobalFilter(globalFilter);
  }, [data, globalFilter, setGlobalFilter]);

  useEffect(() => {
    if (sortBy) {
      setSortBy(sortBy);
    }
  }, [sortBy]);

  useEffect(() => {
    if (onInitTable && !isLoading) {
      onInitTable({ headerGroups, rows });
    }
  }, [isLoading]);

  return (
    <>
      <Table {...getTableProps()} sx={{ position: 'relative' }}>
        {groupBy && groupBy.length > 0 ? (
          <TableHead sx={{ borderTopWidth: 2 }}>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  const groupIcon = column.isGrouped ? <UngroupOutlined /> : <GroupOutlined />;
                  return (
                    <TableCell key={`umbrella-header-cell-${index}`} {...column.getHeaderProps([{ className: column.className }])}>
                      <Stack direction='row' spacing={1.15} alignItems='center' sx={{ display: 'inline-flex', justifyContent: 'center' }}>
                        {column.canGroupBy ? (
                          <Box
                            sx={{
                              color: column.isGrouped ? 'error.main' : 'primary.main',
                              fontSize: '1rem'
                            }}
                            {...column.getGroupByToggleProps()}
                          >
                            {groupIcon}
                          </Box>
                        ) : null}
                        <HeaderSort column={column} sort />
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
        ) : (
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    sx={{ maxWidth: column.maxWidth, minWidth: column.minWidth ? column.minWidth : '' }}
                    key={index}
                    {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}
                  >
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
        )}

        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', height: '200px' }} colSpan={columns.length}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : data.length > 0 && rows.length > 0 ? (
          <TableBody {...getTableBodyProps()}>
            {isFilterTable &&
              headerGroups.map((group) => (
                <TableRow key='row-filter' {...group.getHeaderGroupProps()}>
                  {group.headers.map((column, index) => (
                    <TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
                      {column.canFilter ? column.render('Filter') : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {groupBy && groupBy.length > 0
              ? page.map((row, i) => {
                prepareRow(row);

                return (
                  <TableRow
                    key={i}
                    {...row.getRowProps()}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    {row.cells.map((cell, i) => {
                      let bgcolor = 'inherit';
                      if (cell.isGrouped) bgcolor = 'success.lighter';
                      if (cell.isAggregated) bgcolor = 'warning.lighter';
                      if (row.isSelected) bgcolor = alpha(theme.palette.primary.lighter, 0.35);

                      const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;

                      return (
                        <TableCell key={i} {...cell.getCellProps([{ className: cell.column.className }])} sx={{ bgcolor }}>
                          {/* eslint-disable-next-line */}
                          {cell.isGrouped ? (
                            <Stack direction='row' spacing={1} alignItems='center' sx={{ display: 'inline-flex' }}>
                              <Box
                                sx={{ pr: 1.25, fontSize: '0.75rem', color: 'text.secondary' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  row.toggleRowExpanded();
                                }}
                              >
                                {collapseIcon}
                              </Box>
                              {cell.render('Cell')} ({row.subRows.length})
                            </Stack>
                          ) : cell.isAggregated ? (
                            cell.render('Aggregated')
                          ) : cell.isPlaceholder ? null : (
                            cell.render('Cell')
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
              : page.map((row, i) => {
                prepareRow(row);
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      onClick={() => {
                        row.toggleRowSelected();
                        if (onRowClick) {
                          onRowClick(row); // Call onRowClick prop with row data
                        }
                      }}
                      sx={{
                        cursor: 'pointer'
                      }}
                    >
                      {row.cells.map((cell, index) => (
                        <TableCell
                          key={index}
                          {...cell.getCellProps([{ className: cell.column.className }])}
                          onClick={() => {
                            if (onColumnClick && cell.column.Header === 'Screen Type') {
                              onColumnClick(row);
                            }
                          }}
                          sx={{ cursor: cell.column.Header === 'Screen Type' ? 'pointer' : 'default' }}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                );
              })}
            {hidePagination ? null : (
              <TableRow>
                <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length}>
                  {serverPagination ? (
                    <ServerTablePagination paginationProps={paginationProps} />
                  ) : (
                    <TablePagination
                      gotoPage={gotoPage}
                      totalCount={rows.length}
                      rows={rows}
                      setPageSize={setPageSize}
                      pageSize={pageSize}
                      pageIndex={pageIndex}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', height: '200px' }} colSpan={columns.length}>
                <Typography color='primary' variant='h5'>
                  No records found.
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </>
  );
}
