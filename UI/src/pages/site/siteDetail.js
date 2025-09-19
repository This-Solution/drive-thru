import { Star, StarOutline } from '@mui/icons-material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import InsertChartOutlinedTwoToneIcon from '@mui/icons-material/InsertChartOutlinedTwoTone';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import ReportCard from 'components/cards/statistics/ReportCard';
import CjDialog from 'components/@extended/Dialog';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from 'service/ApiService';
import constants from 'utils/constants';
import dateHelper from 'utils/dateHelper';
import utils from 'utils/utils';
import { Link } from 'react-router-dom';
import { DeleteTwoTone, EditTwoTone, Add } from '@mui/icons-material';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import SaveDiningTableDialog from './saveDiningTable';
import MenuPricing from './menuPricing';
import { filter } from 'lodash';

const SiteDetails = () => {
  const navigate = useNavigate();
  const { siteId, state } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [siteStatisticsData, setSiteStatisticsData] = useState();
  const [siteDetails, setSiteDetails] = useState();
  const [feedbackSummaryData, setFeedbackStatisticsData] = useState();
  const [popularItems, setPopularItems] = useState();
  const [isLoading, setLoading] = useState(true);
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const { flavour } = useSelector((state) => state.auth);
  const isExternal = flavour.isExternal;

  useEffect(() => {
    getSiteDetails();
  }, [siteId]);

  const getSiteDetails = async () => {
    const { data } = await apiService.getSiteDetailsAsync(siteId);
    if (data) {
      setSiteStatisticsData(data.siteStatistics);
      setSiteDetails(data.siteInfo);
      // setFeedbackStatisticsData(data.feedbackStatistics);
      setPopularItems(data.topPopularItems);
      setLoading(false);
    } else {
      navigate('/maintenance/access-denied');
    }
  };

  const SiteStatistics = () => {
    return (
      <Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ReportCard
              primary={utils.formatCurrency(siteStatisticsData.totalSales || '0')}
              secondary='Total Sales'
              color={theme.palette.success.dark}
              iconPrimary={CalculateOutlinedIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ReportCard
              primary={utils.formatCurrency(siteStatisticsData.averageSales || '0')}
              secondary='Average Sales'
              color={theme.palette.primary.dark}
              iconPrimary={InsertChartOutlinedTwoToneIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ReportCard
              primary={siteStatisticsData.totalOrders || '0'}
              secondary='Total Orders'
              color={theme.palette.secondary.main}
              iconPrimary={DiningOutlinedIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ReportCard
              primary={siteStatisticsData.totalCustomer || '0'}
              secondary='Total Customers'
              color={theme.palette.error.main}
              iconPrimary={RememberMeOutlinedIcon}
            />
          </Grid>
        </Grid>
      </Stack>
    );
  };

  const SiteDetails = () => {
    return (
      <MainCard
        title={`Site Name:  ${siteDetails.siteName}`}
        subheader={<>Updated Date: {dateHelper.getFormatDate(siteDetails.updatedDate)}</>}
      >
        <List sx={{ py: 0 }}>
          <ListItem divider={!matchDownMD}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Trading Name</Typography>
                  <Typography>{siteDetails.tradingName || '-'}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Supported Order Modes</Typography>
                  <Typography>{siteDetails.supportedOrderModes || '-'}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem divider={!matchDownMD}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>StoreIdentifier</Typography>
                  <Typography>{siteDetails.storeIdentifier || '-'}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>ABN</Typography>
                  <Typography>{siteDetails.abn || '-'}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem divider={!matchDownMD}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Latitude</Typography>
                  <Typography>{siteDetails.latitude || '-'}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Longitude</Typography>
                  <Typography>{siteDetails.longitude || '-'}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Address</Typography>
                  <Typography>{siteDetails.addressLine1},</Typography>
                  <Typography>{siteDetails.city},</Typography>
                  <Typography>
                    {siteDetails.state} - {siteDetails.postal}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography color='secondary'>Voice Phone</Typography>
                  <Typography>{siteDetails.voicePhone || '-'}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </MainCard>
    );
  };

  const DiningTable = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [isOpenConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
      getDiningTablesBySite();
    }, []);

    const getDiningTablesBySite = async () => {
      const { data } = await apiService.getDiningTableBySiteAsync(siteId);
      if (data) {
        setTables(data);
      }
    }

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    const handleTableSaved = (newTable) => {
      setTables(prev => [...prev, newTable]);
      handleCloseDialog();
      getDiningTablesBySite();
    };

    const handleAddClick = () => {
      setOpenDialog(true);
      setSelectedTable(null);
    };

    const handleEditClick = (row) => {
      setSelectedTable(row);
      setOpenDialog(true);
    };

    const onDeleteTable = async () => {
      if (selectedTable) {
        setLoading(true);
        const { data, friendlyMassage } = await apiService.deleteDiningTableAsync(selectedTable.diningTableId);
        if (data) {
          setTables(filter(tables, (table) => table.diningTableId !== selectedTable.diningTableId));
        }
        setLoading(false);
        dispatch(
          openSnackbar({
            open: true,
            message: data ? 'Table deleted successfully.' : friendlyMassage,
            variant: 'alert',
            alert: {
              color: data ? 'success' : 'error'
            },
            close: true
          })
        );
        setOpenConfirmDialog(false);
      }
    };

    return (
      <Grid rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12}>
          <MainCard content={false}>
            <Stack p={1} direction={'row'} justifyContent={'space-between'} sx={{ mb: 2, mt: 2 }} >
              <Typography variant='h4' sx={{ pl: 1 }}>
                Manage  Dining Table
              </Typography>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddClick}>
                Add Table
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Table No</TableCell>
                    <TableCell align='center'>Seating Capacity</TableCell>
                    <TableCell align='center'>Created By</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tables.length > 0 ? (
                    tables.map((item, id) => (
                      <TableRow key={id}>
                        <TableCell sx={{ pl: 3 }}>
                          <Typography align='left' variant='subtitle1'>
                            {item.tableNo}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{item.seatingCapacity}</TableCell>
                        <TableCell align='center'>
                          <Typography variant='subtitle1'>{item.updatedBy || '-'}</Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {item.updatedDate ? dateHelper.getFormatDate(item.updatedDate) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <Tooltip title='Edit'>
                            <IconButton color="primary">
                              <EditTwoTone onClick={() => handleEditClick(item)} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton color="error">
                              <DeleteTwoTone
                                onClick={() => {
                                  setOpenConfirmDialog(true);
                                  setSelectedTable(item);
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color='primary' variant='h5'>
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {isOpenConfirmDialog && setSelectedTable &&
              <CjDialog
                confirmHandle={onDeleteTable}
                onCancel={() => setOpenConfirmDialog(false)}
                isDialogOpen={isOpenConfirmDialog}
                title='Delete Table'
                Content={`Are you sure want to delete ${selectedTable.tableNo} Table?`}
              ></CjDialog>
            }
            <SaveDiningTableDialog
              open={openDialog}
              onClose={handleCloseDialog}
              siteId={siteId}
              onSave={handleTableSaved}
              tabledata={selectedTable}
            />
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  const OrderRating = () => {
    function LinearProgressWithLabel({ star, total, color, value, ...others }) {
      return (
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='body1' sx={{ minWidth: 50 }}>{`${Math.round(star)} Star`}</Typography>
          <LinearProgress
            value={value}
            variant='determinate'
            color={color}
            {...others}
            sx={{ width: '50%', bgcolor: 'secondary.lighter' }}
          />
          <Typography variant='body1' sx={{ minWidth: 50 }}>{`${Math.round(total)} `}</Typography>
        </Stack>
      );
    }

    LinearProgressWithLabel.propTypes = {
      star: PropTypes.number,
      color: PropTypes.string,
      value: PropTypes.number,
      total: PropTypes.number
    };

    return (
      <Grid container sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <Grid
          item
          alignItems={'center'}
          xl={6}
          lg={7}
          xs={12}
          sx={{
            bgcolor: `${theme.palette.error.main}`,
            position: 'relative',
            p: 2.75,
            borderRadius: { xs: 2, sm: '8px 0px 0px 8px' },
            overflow: 'hidden'
          }}
        >
          <Stack>
            <Typography variant='h1' color='white'>
              Ratings & Reviews
            </Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography variant='h2' color='white'>
                {feedbackSummaryData && feedbackSummaryData.rating ? feedbackSummaryData.rating : 0}
              </Typography>
              <Typography variant='h4' color='white'>
                /5
              </Typography>
            </Stack>
            <Rating
              name='simple-controlled'
              value={feedbackSummaryData.rating}
              icon={<Star />}
              emptyIcon={<StarOutline />}
              readOnly
              precision={0.1}
            />
            <Typography color='white' variant='h5'>
              Based on {`${feedbackSummaryData.totalReviews}`} reviews
            </Typography>
            <Link to={`/order/feedback?siteId=${siteId}`}>
              <Typography color='white' variant='h5'>
                {' '}
                {`${feedbackSummaryData.totalRatings}`} Rating
              </Typography>
            </Link>
          </Stack>
        </Grid>
        <Grid item xl={6} lg={5} xs={12}>
          <MainCard sx={{ borderRadius: { sm: '0px 8px 8px 0px' }, height: '100%', mt: { xs: 2.5, sm: 0 } }}>
            <Grid container alignItems='flex-end' spacing={2}>
              <Grid item xs={12}>
                <LinearProgressWithLabel
                  color='warning'
                  star={5}
                  value={feedbackSummaryData.total5Ratings ? feedbackSummaryData.total5Ratings : 0}
                  total={feedbackSummaryData.total5Ratings ? feedbackSummaryData.total5Ratings : 0}
                />
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel
                  color='warning'
                  star={4}
                  value={feedbackSummaryData.total4Ratings ? feedbackSummaryData.total4Ratings : 0}
                  total={feedbackSummaryData.total4Ratings ? feedbackSummaryData.total4Ratings : 0}
                />
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel
                  color='warning'
                  star={3}
                  value={feedbackSummaryData.total3Ratings ? feedbackSummaryData.total3Ratings : 0}
                  total={feedbackSummaryData.total3Ratings ? feedbackSummaryData.total3Ratings : 0}
                />
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel
                  color='warning'
                  star={2}
                  value={feedbackSummaryData.total2Ratings ? feedbackSummaryData.total2Ratings : 0}
                  total={feedbackSummaryData.total2Ratings ? feedbackSummaryData.total2Ratings : 0}
                />
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel
                  color='warning'
                  star={1}
                  value={feedbackSummaryData.total1Ratings ? feedbackSummaryData.total1Ratings : 0}
                  total={feedbackSummaryData.total1Ratings ? feedbackSummaryData.total1Ratings : 0}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    );
  };

  const renderView = () => {
    return (
      <Grid container spacing={2} display={'flex'}>
        <Grid item xl={12}>
          <Stack spacing={3}>
            <SiteStatistics />
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
              <Grid xl={6} lg={5} xs={12}>
                <Stack spacing={2}>
                  <SiteDetails />
                  {!isExternal ? <MenuPricing /> : null}
                  {/* <OrderRating /> */}
                </Stack>
              </Grid>
              <Grid item xl={6} lg={8} xs={12}>
                <Stack spacing={2}>
                  {!isExternal ? <DiningTable /> : null}
                </Stack>
              </Grid>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    );
  };

  return <>{isLoading ? <Loader /> : renderView()}</>;
};

export default SiteDetails;
