// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Grid, Stack, Typography } from '@mui/material';

// assets
import error500 from 'assets/images/maintenance/Error500.png';

// ==============================|| ERROR 500 - MAIN ||============================== //

function Error500() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container spacing={4} direction='column' alignItems='center' justifyContent='center' sx={{ marginTop: 1, overflow: 'hidden' }}>
        <Grid item xs={12}>
          <Box sx={{ width: { xs: 350, sm: 396 } }}>
            <img src={error500} alt='mantis' style={{ height: '100%', width: '100%' }} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent='center' alignItems='center'>
            <Typography align='center' variant={matchDownSM ? 'h2' : 'h1'}>
              Internal Server Error
            </Typography>
            <Typography color='textSecondary' align='center' sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
              The server encountered an internal error or misconfiguration and was unable to complete your request.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Error500;
