import PropTypes from 'prop-types';
import { forwardRef, useRef, useState } from 'react';

// third-party

// material-ui
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// assets
import { CaretDownOutlined, CaretUpOutlined, CloseSquareFilled } from '@ant-design/icons';

// ==============================|| HEADER SORT ||============================== //

export const HeaderSort = ({ column, sort }) => {
  const theme = useTheme();
  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ display: 'inline-flex' }}>
      <Box>{column.render('Header')}</Box>
      {!column.disableSortBy && (
        <Stack sx={{ color: 'secondary.light' }} {...(sort && { ...column.getHeaderProps(column.getSortByToggleProps()) })}>
          <CaretUpOutlined
            style={{
              fontSize: '0.625rem',
              color: column.isSorted && !column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
          <CaretDownOutlined
            style={{
              fontSize: '0.625rem',
              marginTop: -2,
              color: column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

HeaderSort.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool
};

// ==============================|| TABLE PAGINATION ||============================== //

export const TablePagination = ({ gotoPage, totalCount, setPageSize, pageSize, pageIndex }) => {
  const startRecord = pageIndex * pageSize + 1;
  const endRecord = Math.min(pageIndex * pageSize + pageSize, totalCount);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = (event, value) => {
    gotoPage(value - 1);
  };

  const handleChange = (event) => {
    setPageSize(+event.target.value);
  };

  return (
    <Grid container alignItems='center' justifyContent='space-between' sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography variant='caption' color='secondary'>
              Row per page
            </Typography>
            <FormControl sx={{ m: 1 }}>
              <Select
                id='demo-controlled-open-select'
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                // @ts-ignore
                value={pageSize}
                onChange={handleChange}
                size='small'
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Typography variant='caption' color='textSecondary'>
            Showing {startRecord} - {endRecord} of {totalCount} records
          </Typography>
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          // @ts-ignore
          count={Math.ceil(totalCount / pageSize)}
          // @ts-ignore
          page={pageIndex + 1}
          onChange={handleChangePagination}
          color='primary'
          variant='combined'
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

TablePagination.propTypes = {
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number
};

// ==============================|| SERVER TABLE PAGINATION ||============================== //
export const ServerTablePagination = ({ paginationProps }) => {
  const startRecord = (paginationProps.page - 1) * paginationProps.rowsPerPage + 1;
  const endRecord = Math.min(
    (paginationProps.page - 1) * paginationProps.rowsPerPage + paginationProps.rowsPerPage,
    paginationProps.totalRecords
  );
  return (
    <Grid container alignItems='center' justifyContent='space-between'>
      <Grid item>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='caption' color='secondary'>
            Rows per page
          </Typography>
          <FormControl sx={{ m: 1 }}>
            <Select
              value={paginationProps.rowsPerPage}
              onChange={paginationProps.handleChangeRowsPerPage}
              size='small'
              sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Grid item sx={{ mt: 2 }}>
            <Typography variant='caption' color='textSecondary'>
              Showing {startRecord} - {endRecord} of {paginationProps.totalRecords} records
            </Typography>
          </Grid>
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          count={Math.ceil(paginationProps.totalRecords / paginationProps.rowsPerPage)}
          page={paginationProps.page}
          onChange={paginationProps.handleChangePage}
          color='primary'
          variant='combined'
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

// ==============================|| SELECTION - PREVIEW ||============================== //

export const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  return <Checkbox indeterminate={indeterminate} ref={resolvedRef} {...rest} />;
});

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool
};

export const TableRowSelection = ({ selected }) => (
  <>
    {selected > 0 && (
      <Chip
        size='small'
        // @ts-ignore
        label={`${selected} row(s) selected`}
        color='secondary'
        variant='light'
        sx={{
          position: 'absolute',
          right: -1,
          top: -1,
          borderRadius: '0 4px 0 4px'
        }}
      />
    )}
  </>
);

TableRowSelection.propTypes = {
  selected: PropTypes.number
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200
    }
  }
};

export const HidingSelect = ({ hiddenColumns, setHiddenColumns, allColumns }) => {
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    setHiddenColumns(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        id='column-hiding'
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={<OutlinedInput id='select-column-hiding' placeholder='select column' />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography variant='subtitle1'>all columns visible</Typography>;
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return <Typography variant='subtitle1'>all columns hidden</Typography>;
          }

          return <Typography variant='subtitle1'>{selected.length} column(s) hidden</Typography>;
        }}
        MenuProps={MenuProps}
        size='small'
      >
        {allColumns.map((column, index) => (
          <MenuItem key={index} value={column.id}>
            <Checkbox
              checked={hiddenColumns.indexOf(column.id) > -1}
              color='error'
              checkedIcon={
                <Box
                  className='icon'
                  sx={{
                    width: 16,
                    height: 16,
                    border: '1px solid',
                    borderColor: 'inherit',
                    borderRadius: 0.25,
                    position: 'relative'
                  }}
                >
                  <CloseSquareFilled className='filled' style={{ position: 'absolute' }} />
                </Box>
              }
            />
            <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  allColumns: PropTypes.array
};

// ==============================|| COLUMN SORTING - SELECT ||============================== //

export const SortingSelect = ({ onSortBy, allColumns }) => {
  const [sort, setSort] = useState('');
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setSort(value);
    onSortBy([{ id: value, desc: false }]);
  };

  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        id='column-hiding'
        displayEmpty
        value={sort}
        onChange={handleChange}
        input={<OutlinedInput id='select-column-hiding' placeholder='Sort by' />}
        renderValue={(selected) => {
          const selectedColumn = allColumns.filter((column) => column.accessor === selected)[0];
          if (!selected) {
            return <Typography variant='subtitle1'>Sort By</Typography>;
          }

          return (
            <Typography variant='subtitle2'>
              Sort by ({typeof selectedColumn.Header === 'string' ? selectedColumn.Header : selectedColumn?.title})
            </Typography>
          );
        }}
        size='small'
      >
        {allColumns
          .filter((column) => column?.canSort)
          .map((column, index) => (
            <MenuItem key={index} value={column.accessor}>
              <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.Header} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

SortingSelect.propTypes = {
  setSortBy: PropTypes.func,
  sortBy: PropTypes.string,
  allColumns: PropTypes.array
};
