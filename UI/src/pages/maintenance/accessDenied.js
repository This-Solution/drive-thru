// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// assets
import accessDenied from 'assets/images/maintenance/access-denied.png';
import TwoCone from 'assets/images/maintenance/TwoCone.png';

// ==============================|| ERROR Access Denied - MAIN ||============================== //

function AccessDenied() {
  return (
    <>
      <Grid container spacing={5} direction='column' alignItems='center' justifyContent='center' sx={{ marginTop: 0, overflow: 'hidden' }}>
        <Grid item xs={12}>
          <Stack direction='row'>
            <Grid item>
              <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 500 } }}>
                <img src={accessDenied} alt='mantis' style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
            <Grid item sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 60, left: -40, width: { xs: 130, sm: 390 }, height: { xs: 115, sm: 500 } }}>
                <img src={TwoCone} alt='mantis' style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent='center' alignItems='center'>
            <Typography variant='h1'>Access Denied</Typography>
            <Typography color='textSecondary'>This page can&apos;t be accessed by you!</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default AccessDenied;
