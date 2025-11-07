import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  Typography,
  Grid,
  Stack,
  Button,
  TextField,
  useMediaQuery,
  FormHelperText,
  Collapse,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { useEffect, useState } from 'react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import * as Yup from 'yup';
import apiService from 'service/ApiService';
import dateHelper from 'utils/dateHelper';
import CommentDialog from './commentdialog';
import utils from 'utils/utils';
import { GlobalFilter } from 'components/@extended/Table/ReactTableFilter';
import dayjs from 'dayjs';
import constants from 'utils/constants';
import EmptyTable from 'components/@extended/Table/EmptyTable';
import { TableHeadCustom } from 'components/TableCustomHeader';
import { useTable } from 'components/use-table';

const FILTEREDTABLEHEAD = [
  { id: 'carId', label: '', width: '3%', sortBy: false },
  { id: 'createdDate', label: 'Order Date', width: '10%' },
  { id: 'carType', label: 'Car Type', width: '10%', sortBy: false },
  { id: 'carPlateNumber', label: 'Plate Number', width: '10%', sortBy: false },
  { id: 'carColor', label: 'Car Color', width: '10%' },
  { id: 'totalPrice', label: 'Amount', width: '10%', align: 'right' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, align: 'center' },
];

const SearchOrder = () => {
  const theme = useTheme();
  const table = useTable();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    sortBy: 'createdDate',
    sortDir: 'desc',
  })
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Date is required.').typeError('Invalid date format.'),
    startTime: Yup.date().nullable().required('Opening time is required.').typeError('Invalid time format.'),
    endTime: Yup.date().nullable().required('Closing time is required.').typeError('Invalid time format.')
  });

  useEffect(() => {
    getOrderDetails(formik.values);
  }, [filter]);

  const getOrderDetails = async (payload) => {
    const { data } = await apiService.getOrdersAsync(
      dateHelper.formatDate(payload.date),
      dateHelper.getTimeFormatForSearch(payload.startTime),
      dateHelper.getTimeFormatForSearch(payload.endTime),
      payload.search,
      filter.sortBy,
      filter.sortDir
    );
    if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      startTime: dateHelper.getTimeFromHour(1),
      endTime: dateHelper.getTimeFromHour(0),
      date: dayjs(),
      search: ''
    },
    validationSchema: orderSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      setIsLoading(true);
      getOrderDetails(values);
      if (data) {
        setOrders(data);
      }
      setSubmitting(false);
    }
  });

  const handleCommentClick = (order) => {
    setSelectedOrder(order);
    setCommentDialogOpen(true);
  };

  const handleDialogSave = async (payload) => {
    try {
      await apiService.saveOrderComment(payload);
      setCommentDialogOpen(false);
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleDialogCancel = () => {
    setCommentDialogOpen(false);
  };

  const handleTimeChange = (fieldName) => (value) => {
    formik.setFieldValue(fieldName, value);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSort = (property) => {
    const newOrder = table.orderBy === property && table.order === 'asc' ? 'desc' : 'asc';
    table.setOrder(newOrder);
    table.setOrderBy(property);
    setFilter((pre) => ({ ...pre, sortBy: property, sortDir: newOrder }))
  };

  return (
    <>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack>
              <Typography variant='h2'>Manage Orders</Typography>
            </Stack>
            <Stack direction={'row'} justifyContent={'end'}>
              <Button variant='contained' onClick={() => navigate(-1)}>
                Back
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <MainCard content={false}>
            <ScrollX>
              <Stack spacing={3}>
                <FormikProvider value={formik}>
                  <Form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                      <Stack direction={matchDownMD ? 'column' : 'row'} alignItems='center' spacing={2} sx={{ py: 3, px: 3 }}>
                        <Grid item md={3}>
                          <DatePicker
                            id='date'
                            name='date'
                            value={dayjs(formik.values.date, constants.dateFormat)}
                            label='Date'
                            inputFormat={constants.dateFormat}
                            onChange={(value) => formik.setFieldValue('date', value)}
                            renderInput={(params) => (
                              <TextField fullWidth {...params} error={Boolean(formik.touched.date && formik.errors.date)} />
                            )}
                          />
                          <FormHelperText error={Boolean(formik.touched.date && formik.errors.date)} sx={{ marginLeft: 0 }}>
                            {formik.touched.date && formik.errors.date}
                          </FormHelperText>
                        </Grid>

                        <Grid item md={3}>
                          <TimePicker
                            id='startTime'
                            name='startTime'
                            label='Start Time'
                            value={formik.values.startTime}
                            onChange={handleTimeChange('startTime')}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={Boolean(formik.touched.startTime && formik.errors.startTime)} />
                            )}
                          />
                          <FormHelperText error={Boolean(formik.touched.startTime && formik.errors.startTime)}>
                            {formik.touched.startTime && formik.errors.startTime}
                          </FormHelperText>
                        </Grid>

                        <Grid item md={3}>
                          <TimePicker
                            id='endTime'
                            name='endTime'
                            label='End Time'
                            value={formik.values.endTime}
                            onChange={handleTimeChange('endTime')}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={Boolean(formik.touched.endTime && formik.errors.endTime)} />
                            )}
                          />
                          <FormHelperText error={Boolean(formik.touched.endTime && formik.errors.endTime)}>
                            {formik.touched.endTime && formik.errors.endTime}
                          </FormHelperText>
                        </Grid>

                        <Grid item md={3}>
                          <TextField
                            label='Search Orders'
                            placeholder='Search By Item Name / Plate Number'
                            variant='outlined'
                            name='search'
                            fullWidth
                            size='medium'
                            autoComplete='off'
                            value={formik.values.search}
                            onChange={formik.handleChange}
                          />
                        </Grid>

                        <Grid item md={2}>
                          <Button type='submit' variant='contained' fullWidth>
                            Search
                          </Button>
                        </Grid>
                      </Stack>
                    </Stack>
                  </Form>
                </FormikProvider>
              </Stack>
            </ScrollX>
          </MainCard>

          <Grid container spacing={2} p={2}>
            {isLoading ? (
              <TableContainer>
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center', height: '200px' }} colSpan={6}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) :
              <>
                <Grid item md={12} >
                  <TableContainer>
                    <Table size='small'>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headCells={TABLEHEAD}
                        onSort={handleSort}
                        sx={{
                          backgroundColor: '#F0F0F0'
                        }}
                      />
                      <TableBody>
                        {orders && orders.length > 0 ?
                          orders.map((order, index) => (<>
                            <TableRow hover>
                              <TableCell>
                                <IconButton size='small' onClick={() => handleToggle(index)}>
                                  {openIndex === index ? <UpOutlined /> : <DownOutlined />}
                                </IconButton>
                              </TableCell>
                              <TableCell>{dateHelper.getDateTimeFormat(order.createdDate)}</TableCell>
                              <TableCell>{order.carType}</TableCell>
                              <TableCell>{order.carPlateNumber}</TableCell>
                              <TableCell>{order.carColor}</TableCell>
                              <TableCell align='right'>{order.totalPrice ? utils.formatCurrency(order.totalPrice) : 0}</TableCell>
                              <TableCell align='center'>
                                <IconButton
                                  size='small'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCommentClick(order);
                                  }}
                                >
                                  <CommentIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: '150px', alignItems: 'center' }} colSpan={4}>
                                <Collapse in={openIndex === index} timeout='auto' unmountOnExit>
                                  <Box sx={{ margin: 2 }}>
                                    <Table size='small' sx={{ border: '1px solid #F0F0F0' }}>
                                      <TableHead>
                                        <TableRow sx={{
                                          backgroundColor: '#F0F0F0'
                                        }}>
                                          <TableCell >Item Name</TableCell>
                                          <TableCell >Quantity</TableCell>
                                          <TableCell align='right'>Price ($)</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {order.orderItemData && order.orderItemData.length > 0 && order.orderItemData.map((item, i) => (
                                          <TableRow key={i}>
                                            <TableCell >{item.name}</TableCell>
                                            <TableCell >{item.quantity}</TableCell>
                                            <TableCell align='right'>{utils.formatCurrency(item.price)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </>)) :

                          <TableRow>
                            <TableCell colSpan={7} // Ensure colSpan is at least 1 if orders is empty
                              style={{
                                textAlign: 'center',
                                verticalAlign: 'middle'
                              }}>
                              <EmptyTable msg='No data found.' />
                            </TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item md={12}>
                  <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                    <Typography variant='h6' color="text.secondary">Total Orders :-</Typography>
                    <Typography variant='h6'>{orders && orders.length > 0 ? orders[0].totalCount : 0}</Typography>
                  </Stack>
                </Grid></>
            }
          </Grid>
        </Grid>
      </Grid>
      {commentDialogOpen && selectedOrder ? (
        <CommentDialog open={commentDialogOpen} onSave={handleDialogSave} onCancel={handleDialogCancel} selectedOrder={selectedOrder} />
      ) : null}
    </>
  );
};

export default SearchOrder;
