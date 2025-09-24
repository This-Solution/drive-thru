import { Grid } from '@mui/material';
import Loader from 'components/Loader';
import OrderCard from 'components/OrderCard';
import { useSelector } from 'store';

const OrderManage = () => {
  const { cameraConfig } = useSelector((state) => state.lookup);
  return (
    <>
      <Grid container display={'flex'} direction={'row'} spacing={2}>
        {cameraConfig && cameraConfig.length > 0 ? (
          cameraConfig.map((camera, index) => {
            return (
              <Grid item xs={12} md={12 / cameraConfig.length} key={index}>
                <OrderCard cameraConfig={camera} />
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
