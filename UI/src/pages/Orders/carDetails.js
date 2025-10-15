import { Avatar, Box, Chip, Grid, Stack, Typography } from '@mui/material';
import cameraNotFound from 'assets/images/logos/camera.png';
import OrderItemCard from 'components/cards/OrderItemCard';
import { useMemo } from 'react';
import { useSelector } from 'store';
import ShowCarInfo from './showCarInfo';

import { isEmpty } from 'lodash';
import utils from 'utils/utils';

const CarDetails = ({ cameraInfo }) => {
  const { carDetails } = useSelector((state) => state.carInfo);

  const carAndOrderInfo = useMemo(() => {
    return carDetails.find((car) => car.cameraName === cameraInfo.cameraName);
  }, [carDetails]);

  return (
    <>
      {!isEmpty(carAndOrderInfo) ? (
        <>
          <ShowCarInfo carDetails={carAndOrderInfo.carDetails} />
          {carAndOrderInfo.lastOrders && carAndOrderInfo.lastOrders.length > 0 && (
            <>
              {' '}
              <Stack px={2} pb={2}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography variant='h5'>Last Order</Typography>
                  <Chip
                    label={
                      <Typography
                        sx={{ fontSize: 10, lineHeight: 1 }}
                      >{`Total :- ${utils.formatCurrency(carAndOrderInfo.totalAmount)}`}</Typography>
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
                  {carAndOrderInfo.lastOrders &&
                    carAndOrderInfo.lastOrders.length > 0 &&
                    carAndOrderInfo.lastOrders.map((dish, index) => {
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

          {carAndOrderInfo.mostPurchaseOrder && carAndOrderInfo.mostPurchaseOrder.length > 0 && (
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
                  {carAndOrderInfo.mostPurchaseOrder && carAndOrderInfo.mostPurchaseOrder.length > 0 ? (
                    carAndOrderInfo.mostPurchaseOrder.map((dish, index) => {
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

          {carAndOrderInfo.currentOrders && carAndOrderInfo.currentOrders.length > 0 && (
            <>
              <Stack p={2}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography variant='h5'>Current Order Being Placed</Typography>
                  <Chip
                    label={
                      <Typography
                        sx={{ fontSize: 10, lineHeight: 1 }}
                      >{`Total :- ${utils.formatCurrency(carAndOrderInfo.currentOrders[0].totalPrice)}`}</Typography>
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
                  {carAndOrderInfo.currentOrders.map((dish, index) => {
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
            <Typography variant='body1'>Waiting for next car...</Typography>
          </Stack>
        </Stack>
      )}
    </>
  )
};

export default CarDetails;
