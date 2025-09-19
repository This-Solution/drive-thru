import PropTypes from 'prop-types';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';
import Logo from 'components/logo';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: '100vh' }}>
    <AuthBackground />
    <Grid
      container
      justifyContent='center'
      sx={{
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12}>
        <Grid item xs={12} container display='flex' justifyContent='center'>
          <Grid item xs={12} display='flex' justifyContent='center' sx={{ ml: '8%', mt: '10%' }} alignItems='center' marginTop={1}>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{ bottom: 20, width: '100%', position: 'absolute' }}
        item
        xs={12}
        display='flex'
        justifyContent='center'
        alignItems='center'
      ></Grid>
    </Grid>

  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
