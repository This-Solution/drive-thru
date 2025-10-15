import { useEffect, useState } from 'react';
import { Avatar, Grid, Stack, Typography } from '@mui/material';
import shopkeeper from 'assets/images/icons/merchant.png';
import deliveryMan from 'assets/images/icons/shopkeeper.png';

import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { useStomp } from 'contexts/StompContext';
import { setCarDetails } from 'store/reducers/carInfo';
import { dispatch, store, useSelector } from 'store';
import ApiService from 'service/ApiService';

import _, { filter, isEmpty, map } from 'lodash';
import constants from 'utils/constants';
import dateHelper from 'utils/dateHelper';
import enums from 'utils/enums';
import CarDetails from './carDetails';

const OrderManage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cameraConfig } = useSelector((state) => state.lookup);
  const { user } = useSelector((state) => state.auth);
  const { carDetails } = useSelector((state) => state.carInfo);
  const { lastCars } = useSelector((state) => state.lookup);
  const { carDetailFromCamera } = useStomp();

  useEffect(() => {
    const time = setInterval(() => {
      const { getState, dispatch: _dispatch } = store;
      const { carInfo } = getState();
      if (isEmpty(carInfo.carDetails)) {
        return;
      }
      const filteredRecords = filter(carInfo.carDetails, (_car) => !dateHelper.isBeforeDate(JSON.parse(_car.expirAt)));
      _dispatch(setCarDetails(filteredRecords));
    }, constants.reloadTime);
    return () => {
      clearInterval(time);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(carDetailFromCamera)) {
      fetchCarInformation();
    }
  }, [carDetailFromCamera]);

  useEffect(() => {
    if (lastCars && lastCars.length > 0) {
      getLastCars();
    }
  }, [lastCars]);

  const getLastCars = async () => {
    const lastCarInfo = map(lastCars, (car) => {
      const payload = {
        tenantId: user.tenantId,
        carPlateNumber: car.carPlateNumber,
        cameraType: car.cameraType,
        cameraName: car.cameraName,
        reloadTime: car.reloadTime
      };

      return fetchLastCarDetails(payload);
    });

    const lastCarResponse = await Promise.all(lastCarInfo);
    if (lastCarResponse && lastCarResponse.length > 0) {
      dispatch(setCarDetails(lastCarResponse));
    }
  };

  const fetchLastCarDetails = async (payload) => {
    let carAndOrderDetail = {
      cameraName: payload.cameraName,
      expirAt: JSON.stringify(dateHelper.getTimeFromSeconds(payload.reloadTime))
    };
    if (payload.cameraType === enums.cameraTypeConfig.L) {
      const [carInfo, orderInfo] = await Promise.all([
        ApiService.getCarDetailsAsync(payload),
        ApiService.getLastAndMostPurchaseOrderAsync(payload)
      ]);

      if (carInfo && carInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, carDetails: carInfo.data };
      }

      if (orderInfo && orderInfo.data) {
        carAndOrderDetail = {
          ...carAndOrderDetail,
          lastOrders: orderInfo.data.lastOrders,
          mostPurchaseOrder: orderInfo.data.mostPurchaseOrders,
          totalAmount: orderInfo.data.totalOrderItemPrice
        };
      }
    } else {
      const [carInfo, orderInfo] = await Promise.all([ApiService.getCarDetailsAsync(payload), ApiService.getCurrentOrderAsync(payload)]);
      if (carInfo && carInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, carDetails: carInfo.data };
      }

      if (orderInfo && orderInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, currentOrders: orderInfo.data, totalAmount: orderInfo.data[0].totalPrice };
      }
    }

    return carAndOrderDetail;
  };

  const fetchCarInformation = async () => {
    setIsLoading(true);
    const payload = {
      tenantId: user.tenantId,
      carPlateNumber: carDetailFromCamera.carPlateNumber
    };

    const cameraInfo =
      cameraConfig && !isEmpty(carDetailFromCamera) && cameraConfig.find((cam) => cam.cameraName === carDetailFromCamera.cameraName);
    let carAndOrderDetail = {
      cameraName: carDetailFromCamera.cameraName,
      expirAt: JSON.stringify(dateHelper.getTimeFromSeconds(cameraInfo.reloadTime))
    };
    if (!isEmpty(carDetailFromCamera) && carDetailFromCamera.cameraType === enums.cameraTypeConfig.L) {
      const [carInfo, orderInfo] = await Promise.all([
        ApiService.getCarDetailsAsync(payload),
        ApiService.getLastAndMostPurchaseOrderAsync(payload)
      ]);

      if (carInfo && carInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, carDetails: carInfo.data };
      }

      if (orderInfo && orderInfo.data) {
        carAndOrderDetail = {
          ...carAndOrderDetail,
          lastOrders: orderInfo.data.lastOrders,
          mostPurchaseOrder: orderInfo.data.mostPurchaseOrders,
          totalAmount: orderInfo.data.totalOrderItemPrice
        };
      }
      const index = !isEmpty(carDetailFromCamera) ? carDetails.findIndex((item) => item.cameraName === carDetailFromCamera.cameraName) : -1;
      if (index !== -1) {
        const carInfo = _.cloneDeep(carDetails);
        carInfo[index] = carAndOrderDetail;
        dispatch(setCarDetails([...carInfo]));
      } else {
        dispatch(setCarDetails([...carDetails, carAndOrderDetail]));
      }
    } else {
      const [carInfo, orderInfo] = await Promise.all([ApiService.getCarDetailsAsync(payload), ApiService.getCurrentOrderAsync(payload)]);
      if (carInfo && carInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, carDetails: carInfo.data };
      }

      if (orderInfo && orderInfo.data) {
        carAndOrderDetail = { ...carAndOrderDetail, currentOrders: orderInfo.data, totalAmount: orderInfo.data[0].totalPrice };
      }

      const removeOrderCar =
        !isEmpty(carDetailFromCamera) &&
        carDetails.find(
          (car) =>
            car.carDetails.carPlateNumber === carDetailFromCamera.carPlateNumber &&
            carDetailFromCamera.cameraType !== enums.cameraTypeConfig.L
        );

      const index = !isEmpty(carDetailFromCamera) ? carDetails.findIndex((item) => item.cameraName === carDetailFromCamera.cameraName) : -1;
      if (index !== -1) {
        const carInfo = _.cloneDeep(carDetails);
        carInfo[index] = carAndOrderDetail;
        dispatch(setCarDetails([...carInfo]));
      } else if (!isEmpty(removeOrderCar)) {
        const filterCars = carDetails.filter((car) => car.carDetails.carId !== removeOrderCar.carDetails.carId);
        dispatch(setCarDetails([...filterCars, carAndOrderDetail]));
      } else {
        dispatch(setCarDetails([...carDetails, carAndOrderDetail]));
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Grid container display={'flex'} direction={'row'} spacing={2}>
        {cameraConfig ? (
          cameraConfig.map((camera) => {
            return (
              <Grid item xs={12} md={12 / cameraConfig.length} key={camera.cameraName}>
                <MainCard
                  content={false}
                  sx={{
                    minHeight: '90vh'
                  }}
                >
                  <Stack direction={'row'} justifyContent={'space-between'} p={2}>
                    <Stack>
                      <Typography variant='h5'>{`${camera.cameraName} (${enums.cameraType[camera.cameraType]})`}</Typography>
                      <Typography variant='body2'>{`${camera.description ? camera.description : ''}`}</Typography>
                    </Stack>
                    <Avatar
                      src={camera.cameraType === enums.cameraTypeConfig.L ? deliveryMan : shopkeeper}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Stack>
                  <CarDetails cameraInfo={camera} />
                </MainCard>
              </Grid>
            );
          })
        ) : (
          <Loader />
        )}
      </Grid>
    </>
  );
};

export default OrderManage;
