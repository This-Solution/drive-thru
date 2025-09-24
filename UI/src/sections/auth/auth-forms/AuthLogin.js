import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack
} from '@mui/material';

// third party
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// project import
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import LoadingButton from 'components/@extended/LoadingButton';
import Loader from 'components/Loader';
import useConfig from 'hooks/useConfig';
import ApiService from 'service/ApiService';
import { login, logout, setFlavour } from 'store/reducers/auth';
import { setCameraConfig } from 'store/reducers/lookup';
import utils from 'utils/utils';

// assets

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openFlavourDialog, setFlavourDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const flavours = useSelector((state) => state.lookup.flavours);
  const { onChangePresetColor } = useConfig();
  const twoFactAuth = process.env.REACT_APP_TWO_FACT_AUTH;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFlavorSelect = () => {
    if (!selectedFlavor) return;
    setUserFlavourDetail(selectedFlavor);
    onChangePresetColor(`theme1`);
  };

  const setUserFlavourDetail = async (flavourId) => {
    const flavourDetail = getFlavourDetail(flavourId);
    const token = utils.getTokensFromStorage();
    setLoading(true);
    dispatch(setFlavour({ flavour: flavourDetail }));
    utils.setItemToStorage('flavour', JSON.stringify(flavourDetail));
    const { data, error } = await ApiService.renewSessionAsync({ refreshToken: token.refresh });
    setLoading(false);
    if (data) {
      const token = { session: data.sessionToken, refresh: data.refreshToken };
      localStorage.setItem('phone', data.user.phone);
      dispatch(login({ user: data.user, token }));
      setFlavourDialog(false);
      navigate('/order-trace/cars');
    } else if (error) {
      dispatch(logout());
      setFlavourDialog(false);
      alert(error.email);
    }
  };

  const getFlavourDetail = (flavourId) => {
    const flavourDetail = flavours && flavours.flavours.find((flavour) => flavour.flavourId === flavourId);
    return flavourDetail;
  };

  const FlavourDialog = () => (
    <Dialog open={true} onClose={() => setFlavourDialog(false)} maxWidth='sm' fullWidth>
      <DialogTitle>Select Flavor</DialogTitle>
      <DialogContent>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor='flavourId'>Flavour</InputLabel>
            <Select
              id='flavourId'
              name='flavourId'
              displayEmpty
              value={selectedFlavor}
              onChange={(event) => setSelectedFlavor(Number(event.target.value))}
            >
              <MenuItem value=''>
                <em>Select Flavour</em>
              </MenuItem>
              {flavours &&
                flavours.flavours.map((flavour) => (
                  <MenuItem key={flavour.flavourId} value={flavour.flavourId}>
                    {flavour.flavourName}
                  </MenuItem>
                ))}
            </Select>
          </Stack>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button onClick={() => setFlavourDialog(false)} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} variant='contained' onClick={handleFlavorSelect} disabled={!selectedFlavor} color='primary'>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  const handelCameraInfo = async (siteId) => {
    const { data } = await ApiService.getCameraConfigAsync(siteId);
    if (data) {
      // const cameraConfig = {};
      // data.map((item) => {
      //   if (item.cameraType === "L") {
      //     if (!cameraConfig[item.cameraType]) {
      //       cameraConfig[item.cameraType] = [];
      //     }
      //     cameraConfig[item.cameraType].push(item)
      //   } else if (item.cameraType === "C") {
      //     if (!cameraConfig[item.cameraType]) {
      //       cameraConfig[item.cameraType] = [];
      //     }
      //     cameraConfig[item.cameraType].push(item);
      //   }
      // })
      dispatch(setCameraConfig(data));
    }
  };

  return (
    <>
      {!isLoading ? (
        <Formik
          initialValues={{
            email: '',
            password: '',
            authCode: ''
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Please enter a valid email address.').max(255).required('Email address is required.'),
            password: Yup.string().max(255).required('Password is required.'),
            authCode: Yup.number().when(twoFactAuth, {
              is: () => twoFactAuth === 'true',
              then: Yup.number().required(`Authentication code is required.`),
              otherwise: Yup.number().notRequired()
            })
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setLoading(true);
            setSubmitting(true);
            const { data, error } = await ApiService.loginAsync(values);
            setSubmitting(false);
            if (data) {
              const token = { session: data.sessionToken };
              utils.setTokensToStorage(token);
              // if (data.user.role === enums.userRole.SuperAdmin) {
              //   setFlavourDialog(true);
              // } else {
              // const token = { session: data.sessionToken, refresh: data.refreshToken };
              // const flavourDetail = getFlavourDetail(data.user.flavourId);
              // dispatch(setFlavour({ flavour: flavourDetail }));
              // utils.setItemToStorage('flavour', JSON.stringify(flavourDetail));
              dispatch(login({ user: data.user, token }));
              await handelCameraInfo(data.user.siteId);
              navigate('/order-trace/cars');
              // }
            } else if (error) {
              console.log(error);
              setErrors(error);
            }
            setLoading(false);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <InputLabel htmlFor='email'>Email Address</InputLabel>
                    <OutlinedInput
                      id='email'
                      type='email'
                      value={values.email}
                      name='email'
                      inputProps={{ maxLength: 255 }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder='Enter email address'
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id='email'>
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      inputProps={{ maxLength: 255 }}
                      name='password'
                      onBlur={(event) => {
                        handleBlur(event);
                      }}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                            color='secondary'
                          >
                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder='Enter password'
                    />

                    {touched.password && errors.password && (
                      <FormHelperText error id='password'>
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {twoFactAuth === 'true' ? (
                  <Grid item xs={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Authentication Code</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.authCode && errors.authCode)}
                        id='authCode'
                        value={values.authCode}
                        inputProps={{ maxLength: 6 }}
                        name='authCode'
                        onKeyDown={utils.handleNumericKey}
                        onBlur={(event) => {
                          handleBlur(event);
                        }}
                        onChange={handleChange}
                        placeholder='Enter authentication code'
                      />

                      {touched.authCode && errors.authCode && (
                        <FormHelperText error id='authCode'>
                          {errors.authCode}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                ) : null}

                {/* <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name='checked'
                        color='primary'
                        size='small'
                      />
                    }
                    label={<Typography variant='h6'>Keep me logged in</Typography>}
                  />
                  <Link variant='h6' component={RouterLink} to='/forgot-password' color='text.primary'>
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid> */}
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      color='primary'
                    >
                      Login
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      ) : (
        <Loader />
      )}
      {openFlavourDialog && flavours && <FlavourDialog />}
    </>
  );
};

export default AuthLogin;
