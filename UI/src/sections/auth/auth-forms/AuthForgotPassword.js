import { useDispatch } from 'react-redux';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { useState } from 'react';
import ApiService from 'service/ApiService';
import { openSnackbar } from 'store/reducers/snackbar';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values) => {
          setIsLoading(true);
          const { data } = await ApiService.forgotPasswordAsync(values.email);
          if (data) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Check mail for reset password link',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          }

          setIsLoading(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor='email-forgot'>Email Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id='email-forgot'
                    type='email'
                    value={values.email}
                    name='email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder='Enter email address'
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id='helper-text-email-forgot'>
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant='caption'>Do not forget to check the SPAM folder.</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isLoading} fullWidth size='large' type='submit' variant='contained' color='primary'>
                    Send Password Reset Email
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
