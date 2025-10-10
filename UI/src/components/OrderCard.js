import { CheckOutlined } from '@ant-design/icons';
import {
  Avatar,
  Box,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Link,
  Stack,
  Typography
} from '@mui/material';
import shopkeeper from 'assets/images/icons/merchant.png';
import deliveryMan from 'assets/images/icons/shopkeeper.png';
import cameraNotFound from 'assets/images/logos/camera.png';
import orderNotFound from 'assets/images/logos/OrderNotFound.png';
import { useStomp } from 'contexts/StompContext';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import ApiService from 'service/ApiService';
import { useSelector } from 'store';
import enums from 'utils/enums';
import OrderItemCard from './cards/OrderItemCard';
import MainCard from './MainCard';
import utils from 'utils/utils';
import dateHelper from 'utils/dateHelper';
import { useTheme } from '@emotion/react';

const ShowCarDetails = ({ carDetails }) => {
  const theme = useTheme();

  return (
    <>
      <MainCard content={false} border={false} borderRadius={false}>
        <Stack
          sx={{
            px: 4,
            py: 2,
            position: 'relative',
            background: enums.carBgColor[carDetails.last30DayColorStatus]
          }}
        >
          <ImageList variant='standard' cols={1} gap={2}>
            <ImageListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={carDetails.carImageUrl} alt={'car'} loading='lazy' style={{ width: '80%', height: 'auto', display: 'block' }} />
            </ImageListItem>
            <ImageListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={carDetails.plateImageUrl}
                alt={'car plate'}
                loading='lazy'
                style={{ width: '80%', height: 'auto', display: 'block' }}
              />
            </ImageListItem>
          </ImageList>
        </Stack>
        <Divider />
        <CardContent sx={{ px: 0, py: 0 }}>
          <Grid container>
            <Grid item xs={12}>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                px={2}
                py={1}
                sx={{ backgroundColor: enums.carBgColor[carDetails.last30DayColorStatus] }}
              >
                <Stack>
                  <Typography
                    color='textPrimary'
                    variant='body1'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    Plate Number
                  </Typography>
                  <Typography variant='h6' color={theme.palette.secondary.darker}>
                    {carDetails.carPlateNumber}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    color='textPrimary'
                    variant='body1'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    Type
                  </Typography>
                  <Typography variant='h6' color={theme.palette.secondary.darker}>
                    {carDetails.carType}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    // to={`/apps/e-commerce/product-details/${id}`}
                    color='textPrimary'
                    variant='body1'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    Color
                  </Typography>
                  <Typography variant='h6' color={theme.palette.secondary.darker}>
                    {carDetails.carColor}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    color='textPrimary'
                    variant='body1'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    In Time
                  </Typography>
                  <Typography variant='h6' color={theme.palette.secondary.darker}>
                    {dateHelper.getTimeFormat(carDetails.createdTime)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} px={2} pt={2}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Stack direction={'row'} spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: enums.carStatus[carDetails.last30DayColorStatus],
                        width: '15px',
                        height: '15px'
                      }}
                    >
                      <CheckOutlined style={{ fontSize: '10px' }} />
                    </Avatar>
                    <Typography variant='subtitle2'>Orders (Last 30 Days)</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant='subtitle2'>{carDetails.last30DayCount}</Typography>
                  </Stack>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Stack direction={'row'} spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: enums.carStatus[carDetails.last30To60DayColorStatus],
                        width: '15px',
                        height: '15px'
                      }}
                    >
                      <CheckOutlined style={{ fontSize: '10px' }} />
                    </Avatar>
                    <Typography variant='subtitle2'>Orders (30-60 Days)</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant='subtitle2'>{carDetails.last30To60DayCount}</Typography>
                  </Stack>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Stack direction={'row'} spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: enums.carStatus[carDetails.last60To90DayColorStatus],
                        width: '15px',
                        height: '15px'
                      }}
                    >
                      <CheckOutlined style={{ fontSize: '10px' }} />
                    </Avatar>
                    <Typography variant='subtitle2'>Orders (60-90 Days)</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant='subtitle2'>{carDetails.last60To90DayCount}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </MainCard>
    </>
  );
};

const OrderAndCarDetails = ({
  carDetails = {},
  lastOrders = [],
  totalAmount = 0,
  mostPurchaseOrder = [],
  cameraName = '',
  currentOrders = [],
  cameraReload = 0
}) => {
  const { orderWindow, setOrderWindow, deliveryWindow, setDeliveryWindow } = useStomp();

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (orderWindow[cameraName]) {
        const carDetail = { ...orderWindow };
        delete carDetail[cameraName];
        setOrderWindow(carDetail);
      } else if (deliveryWindow[cameraName]) {
        const carDetail = { ...deliveryWindow };
        delete carDetail[cameraName];
        setDeliveryWindow(carDetail);
      }
    }, cameraReload * 1000);

    return () => {
      clearTimeout(timerId);
    };
  });
  return (
    <>
      <ShowCarDetails carDetails={carDetails} key={carDetails.carId} />
      {lastOrders && lastOrders.length > 0 && (
        <>
          {' '}
          <Stack px={2} pb={2}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant='h5'>Last Order</Typography>
              <Chip
                label={<Typography sx={{ fontSize: 10, lineHeight: 1 }}>{`Total :- ${utils.formatCurrency(totalAmount)}`}</Typography>}
                sx={{
                  backgroundColor: '#b4d8f0',
                  borderRadius: '20px',
                  height: 'auto',
                  px: 1.5,
                  py: 0.5
                }}
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              maxHeight: '30vh',
              overflowY: 'auto',
              mb: 2,
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            px={2}
          >
            <Grid container spacing={1}>
              {lastOrders &&
                lastOrders.length > 0 &&
                lastOrders.map((dish, index) => {
                  return (
                    <>
                      <Grid item xs={12} sm={6} key={index}>
                        <OrderItemCard dish={dish} />{' '}
                      </Grid>
                    </>
                  );
                })}
            </Grid>
          </Box>
        </>
      )}

      {mostPurchaseOrder && mostPurchaseOrder.length > 0 && (
        <>
          <Stack px={2} pb={2}>
            <Typography variant='h5'>Most Purchased Orders</Typography>
          </Stack>
          <Box
            sx={{
              maxHeight: '30vh',
              overflowY: 'auto',
              mb: 2,
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            px={2}
          >
            <Grid container spacing={1}>
              {mostPurchaseOrder && mostPurchaseOrder.length > 0 ? (
                mostPurchaseOrder.map((dish, index) => {
                  return (
                    <>
                      <Grid item xs={12} sm={6} key={index}>
                        <OrderItemCard dish={dish} />{' '}
                      </Grid>
                    </>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Stack alignItems={'center'} justifyContent={'center'} py={3}>
                    <Avatar src={orderNotFound} />
                    <Typography variant='body1'>No Record Found</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}

      {currentOrders && currentOrders.length > 0 && (
        <>
          <Stack p={2}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant='h5'>Current Order Being Placed</Typography>
              <Chip
                label={
                  <Typography
                    sx={{ fontSize: 10, lineHeight: 1 }}
                  >{`Total :- ${utils.formatCurrency(currentOrders[0].totalPrice)}`}</Typography>
                }
                sx={{
                  backgroundColor: '#b4d8f0',
                  borderRadius: '20px',
                  height: 'auto',
                  px: 1.5,
                  py: 0.5
                }}
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              maxHeight: '30vh',
              overflowY: 'auto',
              mb: 2,
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            px={2}
          >
            <Grid container spacing={1}>
              {currentOrders.map((dish, index) => {
                return (
                  <>
                    <Grid item xs={12} sm={6} key={index}>
                      <OrderItemCard dish={dish} />{' '}
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

const OrderCameraView = ({ cameraInfo, cameraReload }) => {
  const [carDetails, setCarDetails] = useState({});
  const [lastOrders, setlastOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mostPurchaseOrder, setMostPurchaseOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { lastCars } = useSelector((state) => state.lookup);

  const { orderWindow, setOrderWindow } = useStomp();
  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: orderWindow[cameraInfo]
    };

    const [carInfo, orderInfo] = await Promise.all([
      ApiService.getCarDetailsAsync(payload),
      ApiService.getLastAndMostPurchaseOrderAsync(payload)
    ]);

    if (carInfo && carInfo.data) {
      setCarDetails(carInfo.data);
    }

    if (orderInfo && orderInfo.data) {
      setlastOrders(orderInfo.data.lastOrders);
      setMostPurchaseOrder(orderInfo.data.mostPurchaseOrders);
      setTotalAmount(orderInfo.data.totalOrderItemPrice);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (lastCars && lastCars.length > 0) {
      const carDetail = lastCars.find((item) => item.cameraName === cameraInfo);
      if (!isEmpty(carDetail)) {
        setOrderWindow({
          ...orderWindow,
          [carDetail.cameraName]: carDetail.carPlateNumber
        });
      }
    }
  }, [lastCars]);

  useEffect(() => {
    if (!isEmpty(orderWindow) && orderWindow[cameraInfo]) {
      fetchCarInformation();
    }

    if (!orderWindow[cameraInfo]) {
      setCarDetails({});
    }
  }, [orderWindow]);

  return (
    <>
      {!isEmpty(carDetails) ? (
        <OrderAndCarDetails
          key={carDetails.carId}
          carDetails={carDetails}
          lastOrders={lastOrders}
          totalAmount={totalAmount}
          mostPurchaseOrder={mostPurchaseOrder}
          cameraName={cameraInfo}
          cameraReload={cameraReload}
        />
      ) : (
        <Stack pt={'calc(16px + 25%)'}>
          <Stack alignItems={'center'} justifyContent={'center'} spacing={2}>
            <Box
              component='img'
              src={cameraNotFound}
              alt='Camera not found'
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%'
              }}
            />
            <Typography variant='body1'>Waiting for next car...</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const DeliveryCameraView = ({ cameraInfo, cameraReload }) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const { deliveryWindow, setDeliveryWindow } = useStomp();
  const { user } = useSelector((state) => state.auth);
  const { lastCars } = useSelector((state) => state.lookup);

  const [isLoading, setIsLoading] = useState(true);

  const fetchCarInformation = async (carPlateNumber = '') => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: deliveryWindow[cameraInfo] ? deliveryWindow[cameraInfo] : carPlateNumber
    };
    const [carInfo, orderInfo] = await Promise.all([ApiService.getCarDetailsAsync(payload), ApiService.getCurrentOrderAsync(payload)]);

    if (carInfo && carInfo.data) {
      setCarDetails(carInfo.data);
    }

    if (orderInfo && orderInfo.data) {
      setCurrentOrders(orderInfo.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (lastCars && lastCars.length > 0) {
      const carDetail = lastCars.find((item) => item.cameraName === cameraInfo);
      if (!isEmpty(carDetail)) {
        setDeliveryWindow({
          ...deliveryWindow,
          [carDetail.cameraName]: carDetail.carPlateNumber
        });
      }
    }
  }, [lastCars]);

  useEffect(() => {
    if (!isEmpty(deliveryWindow) && deliveryWindow[cameraInfo]) {
      fetchCarInformation();
    }
    if (!deliveryWindow[cameraInfo]) {
      setCarDetails({});
    }
  }, [deliveryWindow]);

  return (
    <>
      {!isEmpty(carDetails) ? (
        <OrderAndCarDetails carDetails={carDetails} cameraName={cameraInfo} currentOrders={currentOrders} cameraReload={cameraReload} />
      ) : (
        <Stack pt={'calc(16px + 25%)'}>
          <Stack alignItems={'center'} justifyContent={'center'} spacing={2}>
            <Box
              component='img'
              src={cameraNotFound}
              alt='Camera not found'
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%'
              }}
            />
            <Typography variant='body1'>Waiting for next car...</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const OrderCard = ({ cameraConfig = {} }) => {
  return (
    <MainCard
      content={false}
      sx={{
        minHeight: '90vh'
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'} p={2}>
        <Stack>
          <Typography variant='h5'>{`${cameraConfig.cameraName} (${enums.cameraType[cameraConfig.cameraType]})`}</Typography>
          <Typography variant='body2'>{`${cameraConfig.description ? cameraConfig.description : ''}`}</Typography>
        </Stack>
        <Avatar src={cameraConfig.cameraType === enums.cameraTypeConfig.L ? deliveryMan : shopkeeper} sx={{ width: 40, height: 40 }} />
      </Stack>
      {cameraConfig.cameraType === enums.cameraTypeConfig.L && (
        <>
          <OrderCameraView cameraInfo={cameraConfig.cameraName} cameraReload={cameraConfig.reloadTime} />
        </>
      )}
      {cameraConfig.cameraType === enums.cameraTypeConfig.C && (
        <>
          <DeliveryCameraView cameraInfo={cameraConfig.cameraName} cameraReload={cameraConfig.reloadTime} />
        </>
      )}
    </MainCard>
  );
};

export default OrderCard;
