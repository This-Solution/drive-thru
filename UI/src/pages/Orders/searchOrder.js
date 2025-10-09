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

const SearchOrder = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Date is required.').typeError('Invalid date format.'),
    openingTime: Yup.date().nullable().required('Opening time is required.').typeError('Invalid time format.'),
    closingTime: Yup.date().nullable().required('Closing time is required.').typeError('Invalid time format.')
  });

  useEffect(() => {
    console.log(formik.values);
    getOrderDetails(formik.values);
  }, []);

  const getOrderDetails = async (payload) => {
    const { data } = await apiService.getOrdersAsync(
      dateHelper.formatDate(payload.date),
      dateHelper.getTimeFormat(payload.openingTime),
      dateHelper.getTimeFormat(payload.closingTime),
      search
    );
    if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      openingTime: dayjs(new Date()),
      closingTime: dateHelper.getTimeFromMinutes(30),
      date: dateHelper.formatDate(new Date())
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

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

  const groupedOrders =
    orders &&
    Object.values(
      orders.reduce((acc, item) => {
        if (!acc[item.orderId]) {
          acc[item.orderId] = {
            carColor: item.carColor,
            carId: item.carId,
            carPlateNumber: item.carPlateNumber,
            createdDate: item.createdDate,
            totalPrice: item.totalPrice,
            orderId: item.orderId,
            items: []
          };
        }
        acc[item.orderId].items.push({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        });
        return acc;
      }, {})
    );

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
                            value={formik.values.date}
                            label='Date'
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
                            id='openingTime'
                            name='openingTime'
                            label='Start Time'
                            value={formik.values.openingTime}
                            onChange={handleTimeChange('openingTime')}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={Boolean(formik.touched.openingTime && formik.errors.openingTime)} />
                            )}
                          />
                          <FormHelperText error={Boolean(formik.touched.openingTime && formik.errors.openingTime)}>
                            {formik.touched.openingTime && formik.errors.openingTime}
                          </FormHelperText>
                        </Grid>

                        <Grid item md={3}>
                          <TimePicker
                            id='closingTime'
                            name='closingTime'
                            label='Close Time'
                            value={formik.values.closingTime}
                            onChange={handleTimeChange('closingTime')}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={Boolean(formik.touched.closingTime && formik.errors.closingTime)} />
                            )}
                          />
                          <FormHelperText error={Boolean(formik.touched.closingTime && formik.errors.closingTime)}>
                            {formik.touched.closingTime && formik.errors.closingTime}
                          </FormHelperText>
                        </Grid>

                        <Grid item md={3}>
                          <TextField
                            label='Search Orders'
                            variant='outlined'
                            fullWidth
                            size='medium'
                            autoComplete='off'
                            value={search}
                            onChange={handleSearchChange}
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
            {groupedOrders &&
              groupedOrders.map((order, index) => (
                <Grid item md={12} key={order.orderId}>
                  {isLoading ? (
                    <TableContainer>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ textAlign: 'center', height: '200px' }} colSpan={columns.length}>
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <TableContainer>
                      <Table size='small'>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell />
                            <TableCell>Order Date</TableCell>
                            <TableCell>Plate Number</TableCell>
                            <TableCell>Car Color</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell align='right'>Actions</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow hover>
                            <TableCell>
                              <IconButton size='small' onClick={() => handleToggle(index)}>
                                {openIndex === index ? <UpOutlined /> : <DownOutlined />}
                              </IconButton>
                            </TableCell>

                            <TableCell>{dateHelper.formatDate(order.createdDate)}</TableCell>
                            <TableCell>{order.carPlateNumber}</TableCell>
                            <TableCell>{order.carColor}</TableCell>
                            <TableCell>{order.totalPrice ? utils.formatCurrency(order.totalPrice) : 0}</TableCell>
                            <TableCell align='right'>
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
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                              <Collapse in={openIndex === index} timeout='auto' unmountOnExit>
                                <Box sx={{ margin: 2 }}>
                                  <Table size='small'>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell align='center'>Quantity</TableCell>
                                        <TableCell align='center'>Price ($)</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {order.items.map((item, i) => (
                                        <TableRow key={i}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell align='center'>{item.quantity}</TableCell>
                                          <TableCell align='center'>{utils.formatCurrency(item.price)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              ))}
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
