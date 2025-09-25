import { CheckOutlined } from '@ant-design/icons';
import {
  Avatar,
  Box,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Stack,
  Typography
} from '@mui/material';
import shopkeeper from 'assets/images/icons/merchant.png';
import deliveryMan from 'assets/images/icons/shopkeeper.png';
import orderNotFound from 'assets/images/logos/OrderNotFound.png';
import cameraNotFound from 'assets/images/logos/camera.png';
import { useStomp } from 'contexts/StompContext';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import ApiService from 'service/ApiService';
import { useSelector } from 'store';
import enums from 'utils/enums';
import OrderItemCard from './cards/OrderItemCard';
import MainCard from './MainCard';
import constants from 'utils/constants';
import Dot from './@extended/Dot';

const ShowCarDetails = ({ carDetails }) => {
  return (
    <>
      <MainCard content={false} border={false}>
        <Box sx={{ width: 400, m: 'auto' }}>
          <ImageList variant='standard' cols={2} gap={2}>
            <ImageListItem>
              <img src={carDetails.carImageUrl} alt={'car'} loading='lazy' style={{ width: '100%', height: 'auto', display: 'block' }} />
            </ImageListItem>
            <ImageListItem>
              <img
                src={carDetails.plateImageUrl}
                alt={'car plate'}
                loading='lazy'
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </ImageListItem>
          </ImageList>
        </Box>
        <Divider />
        <CardContent sx={{ px: 0, py: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack direction={'row'} justifyContent={'space-between'} px={2}>
                <Stack>
                  <Typography
                    component={Link}
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
                    Car Plate Number
                  </Typography>
                  <Typography variant='h6' color='textSecondary'>
                    {carDetails.carPlateNumber}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    component={Link}
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
                    Car Type
                  </Typography>
                  <Typography variant='h6' color='textSecondary'>
                    {carDetails.carType}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    component={Link}
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
                    Car Color
                  </Typography>
                  <Typography variant='h6' color='textSecondary'>
                    {carDetails.carColor}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} px={2} pt={1}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Stack direction={'row'} spacing={2}>
                    <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last30DayColorStatus], width: '15px', height: '15px' }}>
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
                    <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last30To60DayColorStatus], width: '15px', height: '15px' }}>
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
                    <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last60To90DayColorStatus], width: '15px', height: '15px' }}>
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
      {/* <Divider /> */}
    </>
  );
};

const OrderAndCarDetails = ({ carDetails, lastOrders, mostPurchaseOrder, cameraName }) => {
  // console.log(cameraName)
  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     console.log('timeout called', cameraName);
  //     // const carDetails = { ...orderWindow };
  //     delete addcamera[cameraName];
  //     // console.log(carDetails);
  //     // setOrderWindow(carDetails);
  //   }, constants.removeCarTime);

  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // });
  return (
    <>
      <ShowCarDetails carDetails={carDetails} />
      {lastOrders && lastOrders.length > 0 && (
        <>
          {' '}
          <Stack px={2} pb={2}>
            <Typography variant='h5'>Last Order</Typography>
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
    </>
  );
};

const OrderCameraView = ({ cameraInfo }) => {
  const [carDetails, setCarDetails] = useState({});
  const [lastOrders, setlastOrders] = useState([]);
  const [mostPurchaseOrder, setMostPurchaseOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const { orderWindow, cameraName, addcamera } = useStomp();
  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: orderWindow[cameraName]
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
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isEmpty(orderWindow) && cameraName === cameraInfo && addcamera[cameraName]) {
      fetchCarInformation();
    }
  }, [orderWindow]);


  return (
    <>
      {!isEmpty(carDetails) ? (
        <OrderAndCarDetails carDetails={carDetails} lastOrders={lastOrders} mostPurchaseOrder={mostPurchaseOrder} cameraName={cameraInfo} />
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
            <Typography variant='body1'>Waiting for new Car....</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const DeliveryCameraView = ({ cameraInfo }) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const { deliveryWindow, cameraName } = useStomp();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: deliveryWindow[cameraName]
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
    if (!isEmpty(deliveryWindow) && cameraName === cameraInfo) {
      fetchCarInformation();
    }
  }, [deliveryWindow]);

  return (
    <>
      {!isLoading ? (
        <>
          <ShowCarDetails carDetails={carDetails} />
          {currentOrders && currentOrders.length > 0 && (
            <>
              <Stack p={2}>
                <Typography variant='h5'>Current Order Being Placed</Typography>
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
            <Typography variant='body1'>Waiting for new Car....</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const OrderCard = ({ cameraConfig = {} }) => {

  return (
    <MainCard content={false} sx={{ minHeight: '90vh' }}>
      <Stack direction={'row'} justifyContent={'space-between'} p={2}>
        <Stack>
          <Typography variant='h5'>{`${cameraConfig.cameraName} (${enums.cameraType[cameraConfig.cameraType]}`})</Typography>
          <Typography variant='body2'>{`${cameraConfig.description ? cameraConfig.description : ''}`}</Typography>
        </Stack>
        <Avatar src={cameraConfig.cameraType === enums.cameraTypeConfig.L ? deliveryMan : shopkeeper} sx={{ width: 40, height: 40 }} />
      </Stack>
      {cameraConfig.cameraType === enums.cameraTypeConfig.L && (
        <>
          <OrderCameraView cameraInfo={cameraConfig.cameraName} />
        </>
      )}
      {cameraConfig.cameraType === enums.cameraTypeConfig.C && (
        <>
          <DeliveryCameraView cameraInfo={cameraConfig.cameraName} />
        </>
      )}
    </MainCard>
  );
};

export default OrderCard;
