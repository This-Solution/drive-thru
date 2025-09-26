import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';

// Global Imports
import 'service/AxiosService';

// Project Imports
import { Box, CircularProgress, Typography } from '@mui/material';
import Snackbar from 'components/@extended/Snackbar';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Routes from 'routes';
import ApiService from 'service/ApiService';
import { setAuthDetail, setFlavour, setTokens } from 'store/reducers/auth';
import ThemeCustomization from 'themes';
import utils from 'utils/utils';
import { setCameraConfig, setTenant } from 'store/reducers/lookup';
import { openSnackbar } from 'store/reducers/snackbar';
import useConfig from 'hooks/useConfig';


const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [isTokenChecked, setIsTokenChecked] = useState(isLoading);

  const { onChangePresetColor } = useConfig();

  useEffect(() => {
    getTentant();
    bindInitData(false);
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getTentant = async () => {
    const { data } = await ApiService.getTenantsAsync();
    if (data) {
      dispatch(setTenant({ tenants: data }));
    }
  };

  const getCameraInfo = async (siteId) => {
    const { data } = await ApiService.getCameraConfigAsync(siteId);
    if (data) {
      dispatch(setCameraConfig(data));
    }
  };

  const handleMessage = async (event) => {
    if (event.data.refreshToken && event.data.flavour) {
      dispatch(setFlavour({ flavour: event.data.flavour }));
      utils.setItemToStorage('flavour', JSON.stringify(event.data.flavour));
      await renewSession(event.data.refreshToken);
      bindInitData(true);
      onChangePresetColor(`theme1`);
    }
  };

  const renewSession = async (refreshToken) => {
    try {
      const { data, error } = await ApiService.renewSessionAsync({ refreshToken });
      if (data) {
        const token = { session: data.sessionToken, refresh: data.refreshToken };
        utils.setTokensToStorage(token);
        localStorage.setItem('phone', data.user.phone);
        const currentTokenUser = jwtDecode(token.session);
        dispatch(setAuthDetail({ user: currentTokenUser, token }));
      } else if (error) {
        showMessage(error.email, 'error');
      }
    } catch (error) {
      console.debug('generate session token issue : ', error);
    } finally {
      setIsTokenChecked(false);
    }
  };

  const bindInitData = async (isSSO) => {
    const token = utils.getTokensFromStorage();
    // const flavour = utils.getItemFromStorage('flavour');
    if (token) {
      const currentTokenUser = jwtDecode(token.session);
      // dispatch(setFlavour({ flavour: JSON.parse(flavour) }));
      dispatch(setAuthDetail({ user: currentTokenUser, token }));
      getCameraInfo(currentTokenUser.siteId)
      setIsTokenChecked(false);
    } else {
      setIsTokenChecked(false);
      if (isSSO) {
        dispatch(setTokens({ token: null }));
      }
    }
  };

  const showMessage = async (message, color) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: {
          color: color
        },
        close: true
      })
    );
  };

  const AuthLoader = () => (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='100vh'>
      <CircularProgress size={60} color={'success'} />
      <Typography variant='h6' sx={{ marginTop: 2 }}>
        Authenticating, please wait...
      </Typography>
    </Box>
  );

  if (isTokenChecked) {
    return <AuthLoader />;
  }

  return (
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <Routes />
          <Snackbar />
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  );
};

export default App;
