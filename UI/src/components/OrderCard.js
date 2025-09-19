import { Avatar, Box, Chip, Grid, Stack, Typography } from '@mui/material';
import shopkeeper from 'assets/images/icons/merchant.png';
import deliveryMan from 'assets/images/icons/shopkeeper.png';
import orderNotFound from 'assets/images/logos/OrderNotFound.png';
import { useStomp } from 'contexts/StompContext';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import ApiService from 'service/ApiService';
import { useSelector } from 'store';
import enums from 'utils/enums';
import OrderItemCard from './cards/OrderItemCard';
import MainCard from './MainCard';

const ShowCarDetails = ({ user, carDetail }) => {
  const [carDetails, setCarDetails] = useState({});

  useEffect(() => {
    if (!isEmpty(carDetail)) getCarDetails();
  }, [carDetail]);

  const getCarDetails = async () => {
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: carDetail.carPlateNumber
    };

    const { data } = await ApiService.getCarDetailsAsync(payload);
    if (data) {
      setCarDetails(data);
    }
  };
  return (
    <>
      <Grid container px={2} direction={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={4}>
          <Stack>
            <Box component='img' src={carDetails.imageUrl && carDetails.imageUrl[0]} alt='car' sx={{ width: '100%', height: 'auto' }} />
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
          <Box display='flex' flexDirection='column' bgcolor='#F2F0EF'>
            <Box
              sx={{
                py: 2,
                // borderBottom: idx < 2 ? '1px solid #fff' : 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box sx={{ px: 1 }}>
                <Box sx={{ width: 28, height: 28 }}>
                  <Chip
                    component="span"
                    color={enums.carStatus[carDetails.carColorStatus]}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      '& .MuiChip-label': {
                        px: 0.5
                      },
                    }}
                  />
                  {/* <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    style={{ width: '100%', height: '100%' }}
                  >
                    <circle cx='12' cy='12' r='10' stroke={enums.carStatus[carDetails.carColorStatus]}></circle>
                    <path d='M9 12l2 2l4-4' stroke={enums.carStatus[carDetails.carColorStatus]}></path>
                  </svg> */}
                </Box>
              </Box>
              <Box>
                <Typography variant='h5'>Total Order</Typography>
                <Typography variant='body1'>{carDetails.orderCount}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const ShowLastAndPurchaseOrders = () => {
  const [lastOrders, setlastOrders] = useState([]);
  const [mostPurchaseOrder, setMostPurchaseOrder] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const { orderWindow } = useStomp();

  useEffect(() => {
    if (!isEmpty(orderWindow)) {
      getLastAndMostPurchaseOrders();
    }
  }, [orderWindow]);

  const getLastAndMostPurchaseOrders = async () => {
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: orderWindow.carPlateNumber
    };
    const { data } = await ApiService.getLastAndMostPurchaseOrderAsync(payload);
    if (data) {
      setlastOrders(data.lastOrders);
      setMostPurchaseOrder(data.mostPurchaseOrders);
    }
  };

  return (
    <>
      <ShowCarDetails user={user} carDetail={orderWindow} />
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

              <Stack alignItems={'center'} justifyContent={'center'} py={6}>
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
              <Stack alignItems={'center'} justifyContent={'center'} py={6}>
                <Avatar src={orderNotFound} />
                <Typography variant='body1'>No Record Found</Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

const ShowCurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const { deliveryWindow } = useStomp();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isEmpty(deliveryWindow)) {
      getCurrentOrders();
    }
  }, [deliveryWindow]);

  const getCurrentOrders = async () => {
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: deliveryWindow.carPlateNumber
    };
    const { data } = await ApiService.getCurrentOrderAsync(payload);
    if (data) {
      console.log(data);
      setCurrentOrders(data);
    }
  };

  return (
    <>
      <ShowCarDetails user={user} carDetail={deliveryWindow} />
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
        {currentOrders && currentOrders.length > 0 ? (
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
        ) : (
          <Grid item xs={12}>
            <Stack alignItems={'center'} justifyContent={'center'} py={6}>
              <Avatar src={orderNotFound} />
              <Typography variant='body1'>No Record Found</Typography>
            </Stack>
          </Grid>
        )}
      </Box>
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
