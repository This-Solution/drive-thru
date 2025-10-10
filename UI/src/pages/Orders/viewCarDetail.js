import { CloseOutlined } from '@ant-design/icons';
import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material';
import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ApiService from 'service/ApiService';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';

const ViewCarDetail = ({ onCancel, carPlateNumber }) => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [carDetail, setCarDetail] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    viewCarDetail();
  }, []);

  const viewCarDetail = async () => {
    const { data } = await ApiService.getCarDetailAsync({ tenantId: user.tenantId, carPlateNumber: carPlateNumber });
    setCarDetail(data?.carData);
    setLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Dialog maxWidth='md' fullWidth open={true} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <DialogTitle sx={{ m: -1, p: -1 }}>{'Car Detail'}</DialogTitle>
            <IconButton disabled={isLoading} onClick={onCancel}>
              <CloseOutlined twoToneColor={theme.palette.error.main} />
            </IconButton>
          </Box>
          <Divider />
          <DialogContent sx={{ p: 1 }}>
            {!carDetail ? (
              <Typography color='primary' variant='h5' align='center'>
                No order detail found.
              </Typography>
            ) : (
              <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Grid item xs={12} sm={6}>
                  <pre>{JSON.stringify(carDetail, null, 2)}</pre>
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

ViewCarDetail.propTypes = {
  onCancel: PropTypes.func
};

export default ViewCarDetail;
