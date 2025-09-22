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
import { useTheme } from '@emotion/react';
import { CheckCircleTwoTone, CheckOutlined } from '@ant-design/icons';

const ShowCarDetails = ({ user, carDetail }) => {
  const [carDetails, setCarDetails] = useState({});

  const theme = useTheme();

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
          <Box display='flex' flexDirection='column'>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #fff'
              }}
            >
              <Avatar sx={{ bgcolor: enums.carStatus['GREEN'], width: '30px', height: '30px', ml: 2 }}>
                <CheckOutlined style={{ fontSize: '16px' }} />
              </Avatar>
              <Box sx={{ p: 2 }}>
                <Typography variant='body1'>Order No (Last 30 days)</Typography>
                <Typography variant='body1'>10</Typography>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column'>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #fff'
              }}
            >
              <Avatar sx={{ bgcolor: enums.carStatus['RED'], width: '30px', height: '30px', ml: 2 }}>
                <CheckOutlined style={{ fontSize: '16px' }} />
              </Avatar>
              <Box sx={{ p: 2 }}>
                <Typography variant='body1'>Order No (30-60 days)</Typography>
                <Typography variant='body1'>12</Typography>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column'>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #fff'
              }}
            >
              <Avatar sx={{ bgcolor: enums.carStatus['PINK'], width: '30px', height: '30px', ml: 2 }}>
                <CheckOutlined style={{ fontSize: '16px' }} />
              </Avatar>
              <Box sx={{ p: 2 }}>
                <Typography variant='body1'>Order No (60-90 days)</Typography>
                <Typography variant='body1'>15</Typography>
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { orderWindow } = useStomp();

  useEffect(() => {
    if (!isEmpty(orderWindow)) {
      getLastAndMostPurchaseOrders();
    }
  }, [orderWindow]);

  const getLastAndMostPurchaseOrders = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: orderWindow.carPlateNumber
    };
    const { data } = await ApiService.getLastAndMostPurchaseOrderAsync(payload);
    if (data) {
      setlastOrders(data.lastOrders);
      setMostPurchaseOrder(data.mostPurchaseOrders);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isLoading ? (
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
              {lastOrders.map((dish, index) => {
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
              {mostPurchaseOrder.map((dish, index) => {
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
      ) : (
        <Stack pt={'calc(16px + 45%)'}>
          <Stack alignItems={'center'} justifyContent={'center'}>
            <Avatar src={orderNotFound} />
            <Typography variant='body1'>No Record Found</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const ShowCurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const { deliveryWindow } = useStomp();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEmpty(deliveryWindow)) {
      getCurrentOrders();
    }
  }, [deliveryWindow]);

  const getCurrentOrders = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: deliveryWindow.carPlateNumber
    };
    const { data } = await ApiService.getCurrentOrderAsync(payload);
    if (data) {
      console.log(data);
      setCurrentOrders(data);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isLoading ? (
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
      ) : (
        <Stack pt={'calc(16px + 45%)'}>
          <Stack alignItems={'center'} justifyContent={'center'}>
            <Avatar src={orderNotFound} />
            <Typography variant='body1'>No Record Found</Typography>
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
