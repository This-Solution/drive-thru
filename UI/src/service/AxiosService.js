import axios from 'axios';
import jwtDecode from 'jwt-decode';
import _, { isNull } from 'lodash';

// project import
import { logout, setTokens } from 'store/reducers/auth';
import { openSnackbar } from 'store/reducers/snackbar';
import constants from 'utils/constants';
import enums from 'utils/enums';
import utils from 'utils/utils';
import { store } from '../store';
import ApiService from './ApiService';

const { getState, dispatch } = store;

const formatValidationError = (error) => {
  const validationErrors = {};

  validationErrors[error.errorTitle] = error.errorMessage;
  return validationErrors;
};
// defaults
// const baseUrl = process.env.REACT_APP_API_BASE_URL;
// axios.defaults.baseURL = baseUrl;

// request interceptor
axios.interceptors.request.use(
  async (config) => {
    const { auth } = getState();

    config.baseURL = process.env.REACT_APP_API_BASE_URL

    // config.baseURL = 'http://localhost:8080';
    // set header if url is our api due to s3 gives error of bad request reason is token
    if (auth.sessionToken && !config.url.includes('amazonaws.com')) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${auth.sessionToken}`
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  async (response) => {
    const { data, status } = response;
    if (_.isNil(data) && status !== enums.ApiResult.ValidationError) {
      showErrorToast(constants.defaultErrorMessage);
      return { data, status };
    }
    return { data: data.data };
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && (error.response.status === enums.ApiResult.ValidationError || error.response.status === enums.ApiResult.BadRequest)) {
      return { data: null, error: formatValidationError(error.response.data) };
    }

    if (error.response && error.response.status === enums.ApiResult.AccessDenied && !originalRequest._retry) {
      originalRequest._retry = true;

      const isTokenUpdated = await refreshTokens();

      if (isTokenUpdated) {
        return await axios(originalRequest);
      } else {
        dispatch(logout());
        showErrorToast(constants.defaultErrorMessage);
        return { data: null };
      }
    } else if (error.response && error.response.status === enums.ApiResult.AccessDenied) {
      dispatch(logout());
    }

    showErrorToast(constants.defaultErrorMessage);
    return { data: null };
  }
);
// refresh token
async function refreshTokens() {
  const state = getState();
  const { sessionToken } = state.auth;
  let { refreshToken } = state.auth;

  if (isNull(sessionToken) || isNull(refreshToken)) {
    return false;
  }

  // todo:: changes refresh code according new axios service
  const { emailAddress } = jwtDecode(sessionToken);
  const { data } = await ApiService.authRenewTokenApiAsync({ emailAddress, refreshToken });
  if (data) {
    if (data?.token?.refresh) {
      refreshToken = data?.token?.refresh;
    }
    utils.setTokensToStorage({ refresh: refreshToken, session: data?.token?.session });
    dispatch(setTokens({ token: { refresh: refreshToken, session: data?.token?.session } }));
    return true;
  }

  return false;
}

const showErrorToast = (message) => {
  dispatch(
    openSnackbar({
      open: true,
      message,
      variant: 'alert',
      alert: {
        color: 'error'
      }
    })
  );
};
