import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import ApiService from 'service/ApiService';
import { login } from 'store/reducers/auth';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [user, setUser] = useState(null);

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (params.token) {
      verifyPasswordResetToken();
    }
  }, []);

  const verifyPasswordResetToken = async () => {
    setIsLoading(true);

    const { data } = await ApiService.verifyPasswordResetTokenAsync(params.token);
    if (data) {
      setUser(data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Your reset password request is invalid.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );

      navigate('/login');
    }

    setIsLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required('Password is required'),
          confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .when('password', {
              is: (val) => !!(val && val.length > 0),
              then: Yup.string().oneOf([Yup.ref('password')], 'Both Password must be match!')
            })
        })}
        onSubmit={async (values) => {
          // password reset
          const payload = btoa(`${user.userId}:${values.password}`);

          const { data } = await ApiService.resetPasswordAsync(payload);
          if (data) {
            dispatch(login({ user: data.user, token: data.token }));
            navigate('/dashboard/reports');
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {isLoading ? (
              <Stack direction='column' justifyContent='center' spacing={3} alignItems='center' height={350} width={380}>
                <CircularProgress />
                <Typography variant='h5' textAlign='center'>
                  Please wait while checking your reset password request...
                </Typography>
              </Stack>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
                    <Typography variant='h3'>Reset Password</Typography>
                    <Typography color='secondary'>Please choose your new password</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='password-reset'>Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id='password-reset'
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name='password'
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                            color='secondary'
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder='Enter password'
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id='helper-text-password-reset'>
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle1' fontSize='0.75rem'>
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='confirm-password-reset'>Confirm Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      id='confirm-password-reset'
                      type='password'
                      value={values.confirmPassword}
                      name='confirmPassword'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder='Enter confirm password'
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText error id='helper-text-confirm-password-reset'>
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

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
                      Reset Password
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            )}
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthResetPassword;
