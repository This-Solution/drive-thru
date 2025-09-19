import { useEffect, useMemo } from 'react';

// material-ui
import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material';

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
import { DefaultColumnFilter, renderFilterTypes } from 'components/@extended/Table/ReactTableFilter';
import { HeaderSort, TablePagination } from 'components/@extended/Table/ReactTableHeader';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default function DragDropTable({ onDragEnd, columns, data, globalFilter = null, hiddenColumns = [], isLoading = false, hidePagination }) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const getHeaderProps = (column) => column.getSortByToggleProps();

  const initialState = useMemo(
    () => ({
      hiddenColumns: hiddenColumns,
      pageSize: 25
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
    state: { pageIndex, pageSize },
    setGlobalFilter
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
      initialState
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
    setGlobalFilter(globalFilter);
  }, [data, globalFilter, setGlobalFilter]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table {...getTableProps()} sx={{ position: 'relative' }}>
          {
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
          }
          {headerGroups.map((group, i) => (
            <TableRow key={i} {...group.getHeaderGroupProps()}>
              {group.headers.map((column, index) => (
                < TableCell key={index} {...column.getHeaderProps([{ className: column.className }])} >
                  {column.canFilter ? column.render('Filter') : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', height: '200px' }} colSpan={columns.length}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : data.length > 0 && rows.length > 0 ? (
            <Droppable droppableId={'row'}>
              {(provided, snapshot) => (
                <TableBody
                  {...getTableBodyProps()}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'whitesmoke' : 'white',
                    padding: 4,
                    width: 250,
                    minHeight: 500, // Adjust the minHeight as needed
                    ...provided.droppableProps.style
                  }}
                  {...provided.droppableProps}
                >
                  {page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <Draggable draggableId={row.id} key={row.id} index={rowIndex}>
                        {(provided, snapshot) => (
                          <TableRow
                            {...row.getRowProps()}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{ ...(snapshot.isDragging && { backgroundColor: 'white', boxShadow: 2 }) }}
                          >
                            {row.cells.map((cell, index) =>
                              index === 1 ? (
                                <TableCell
                                  key={index}
                                  {...cell.getCellProps([{ className: cell.column.className }])}
                                  {...provided.dragHandleProps}
                                >
                                  {cell.render('Cell')}
                                </TableCell>
                              ) : (
                                <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                                  {cell.render('Cell')}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
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
          {hidePagination ? null :
            (<TableFooter>
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length}>
                  <TablePagination
                    gotoPage={gotoPage}
                    totalCount={rows.length}
                    rows={rows}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>)}
        </Table>
      </DragDropContext>
    </>
  );
}
