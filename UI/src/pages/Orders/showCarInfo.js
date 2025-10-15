import { CheckOutlined } from '@ant-design/icons';
import { Avatar, CardContent, Divider, Grid, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@emotion/react';

import MainCard from 'components/MainCard';
import ViewCarDetail from './viewCarDetail';
import enums from 'utils/enums';
import dateHelper from 'utils/dateHelper';

const ShowCarInfo = ({ carDetails }) => {
  const theme = useTheme();
  const [openCarDetailDialog, setOpenCarDetailDialog] = useState(false);

  const handleClick = (e) => {
    if (e.detail === 3) {
      setOpenCarDetailDialog(true);
    }
  };
  return (
    <>
      <MainCard content={false} border={false} borderRadius={false}>
        <Stack
          sx={{
            px: 4,
            py: 2,
            position: 'relative',
            background: carDetails.last30DayCount > 0 ? enums.carBgColor[carDetails.last30DayColorStatus] : '#D6E4FF'
          }}
        >
          <ImageList variant='standard' cols={1} gap={2} onClick={(e) => handleClick(e)}>
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
                sx={{ backgroundColor: carDetails.last30DayCount > 0 ? enums.carBgColor[carDetails.last30DayColorStatus] : '#D6E4FF' }}
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
        {openCarDetailDialog && <ViewCarDetail onCancel={() => setOpenCarDetailDialog(false)} carPlateNumber={carDetails.carPlateNumber} />}
      </MainCard>
    </>
  );
};

export default ShowCarInfo;
