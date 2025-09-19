// material-ui
import { Box, Stack, useMediaQuery } from '@mui/material'

// project import
import MobileSection from './MobileSection';
import Profile from './Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {/* {!matchesXs && (
        <Stack
          direction='row'
          sx={{ width: '100%', ml: { xs: 0, md: 1 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        ></Stack>
      )} */}
      {/* {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />} */}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
