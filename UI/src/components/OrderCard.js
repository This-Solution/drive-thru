import { CheckOutlined } from '@ant-design/icons';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
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

const ShowCarDetails = ({ carDetails }) => {
  return (
    <>
      <Grid container px={2} direction={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={4}>
          <Stack>
            <Box component='img' src={carDetails.carImageUrl} alt='car' sx={{ width: '100%', height: 'auto' }} />
          </Stack>
        </Grid>
        <Grid item xs={4} bgcolor={'#F2F0EF'}>
          <Box display='flex' flexDirection='column'>
            <Box sx={{ p: 2, borderBottom: '1px solid #fff' }}>
              <Typography variant='h5'>Car No.</Typography>
              <Typography variant='body2'>{carDetails.carPlateNumber}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant='h5'>Color</Typography>
              <Typography variant='body2'>{carDetails.carColor}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} bgcolor={'#F2F0EF'}>
          {carDetails.last30DayColorStatus === enums.carStatus.WHITE && (
            <Box display='flex' flexDirection='column'>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #fff'
                }}
              >
                <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last30DayColorStatus], width: '30px', height: '30px', ml: 2 }}>
                  <CheckOutlined style={{ fontSize: '16px' }} />
                </Avatar>
                <Box sx={{ p: 2 }}>
                  <Typography variant='body1'>Order No (Last 30 days)</Typography>
                  <Typography variant='body1'>{carDetails.last30DayCount}</Typography>
                </Box>
              </Box>
            </Box>
          )}
          {carDetails.last30DayCount > 0 && (
            <Box display='flex' flexDirection='column'>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #fff'
                }}
              >
                <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last30DayColorStatus], width: '30px', height: '30px', ml: 2 }}>
                  <CheckOutlined style={{ fontSize: '16px' }} />
                </Avatar>
                <Box sx={{ p: 2 }}>
                  <Typography variant='body1'>Order No (Last 30 days)</Typography>
                  <Typography variant='body1'>{carDetails.last30DayCount}</Typography>
                </Box>
              </Box>
            </Box>
          )}
          {carDetails.last30To60DayCount > 0 && (
            <Box display='flex' flexDirection='column'>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #fff'
                }}
              >
                <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last30To60DayColorStatus], width: '30px', height: '30px', ml: 2 }}>
                  <CheckOutlined style={{ fontSize: '16px' }} />
                </Avatar>
                <Box sx={{ p: 2 }}>
                  <Typography variant='body1'>Order No (30-60 days)</Typography>
                  <Typography variant='body1'>{carDetails.last30To60DayCount}</Typography>
                </Box>
              </Box>
            </Box>
          )}
          {carDetails.last60To90DayCount > 0 && (
            <Box display='flex' flexDirection='column'>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #fff'
                }}
              >
                <Avatar sx={{ bgcolor: enums.carStatus[carDetails.last60To90DayColorStatus], width: '30px', height: '30px', ml: 2 }}>
                  <CheckOutlined style={{ fontSize: '16px' }} />
                </Avatar>
                <Box sx={{ p: 2 }}>
                  <Typography variant='body1'>Order No (60-90 days)</Typography>
                  <Typography variant='body1'>{carDetails.last60To90DayCount}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

const ShowLastAndPurchaseOrders = () => {
  const [carDetails, setCarDetails] = useState({});
  const [lastOrders, setlastOrders] = useState([]);
  const [mostPurchaseOrder, setMostPurchaseOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const { orderWindow } = useStomp();

  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: orderWindow.carPlateNumber
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
    if (!isEmpty(orderWindow)) {
      fetchCarInformation();
    }
  }, [orderWindow]);

  return (
    <>
      {!isLoading ? (
        <>
          <ShowCarDetails carDetails={carDetails} />
          <Stack p={2}>
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
              {lastOrders && lastOrders.length > 0 ? (
                lastOrders.map((dish, index) => {
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
          <Stack p={2}>
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
      ) : (
        <Stack pt={'calc(16px + 25%)'}>
          <Stack alignItems={'center'} justifyContent={'center'} spacing={2}>
            <Box
              component="img"
              src={cameraNotFound}
              alt="Camera not found"
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
              }}
            />
            <Typography variant='body1'>Waiting for new Car....</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const ShowCurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const { deliveryWindow } = useStomp();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: deliveryWindow.carPlateNumber
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
    if (!isEmpty(deliveryWindow)) {
      fetchCarInformation();
    }
  }, [deliveryWindow]);

  return (
    <>
      {!isLoading ? (
        <>
          <ShowCarDetails carDetails={carDetails} />
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
              {currentOrders && currentOrders.length > 0 ? (
                currentOrders.map((dish, index) => {
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
                  <Stack alignItems={'center'} justifyContent={'center'}>
                    <Avatar src={orderNotFound} />
                    <Typography variant='body1'>No Record Found</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      ) : (
        <Stack pt={'calc(16px + 25%)'}>
          <Stack alignItems={'center'} justifyContent={'center'} spacing={2}>
            <Box
              component="img"
              src={cameraNotFound}
              alt="Camera not found"
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
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
          <Typography variant='h5'>{cameraConfig.cameraName}</Typography>
          <Typography variant='body2'>{enums.cameraType[cameraConfig.cameraType]}</Typography>
        </Stack>
        <Avatar src={cameraConfig.cameraType === 'L' ? deliveryMan : shopkeeper} sx={{ width: 40, height: 40 }} />
      </Stack>
      {cameraConfig.cameraType === 'L' && (
        <>
          <ShowLastAndPurchaseOrders />
        </>
      )}
      {cameraConfig.cameraType === 'C' && (
        <>
          <ShowCurrentOrders />
        </>
      )}
    </MainCard>
  );
};

export default OrderCard;
