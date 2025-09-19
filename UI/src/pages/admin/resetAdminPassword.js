import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField
} from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import ApiService from 'service/ApiService';
import { openSnackbar } from 'store/reducers/snackbar';
import * as Yup from 'yup';

const resetAdminPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required.').max(100, 'Password cannot be more than 100 characters.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Confirm password does not match the password.')
    .required('Confirm password is required.')
    .max(100, 'Confirm password cannot be more than 100 characters.')
});

const ResetAdminPassword = ({ systemUser, onCancel, onSave }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const name = systemUser.firstName + ' ' + systemUser.surName;
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: resetAdminPasswordSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      const { password } = values;
      const payload = { password: btoa(password) };
      if (systemUser.guid) {
        payload.guid = systemUser.guid;
      }
      setLoading(true);
      let data, error;
      if (payload.guid) {
        ({ data, error } = await ApiService.resetAdminPasswordAsync(payload));
      } else {
        ({ data, error } = await ApiService.resetPasswordAsync(payload));
      }
      setLoading(false);
      if (data) {
        await onSavePassword();
      } else if (error) {
        setErrors(error);
      }
      setSubmitting(false);
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSavePassword = async () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Reset password successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    setLoading(false);
    onSave(systemUser);
    onCancel();
  };

  const { errors, touched, handleSubmit, values, getFieldProps } = formik;

  return (
    <>
      <Dialog maxWidth='xs' fullWidth open={true} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        <FormikProvider value={formik}>
          <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
            <DialogTitle>{`Reset Password - ${systemUser.name ? systemUser.name : name}`}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'column' } }}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <OutlinedInput
                      id='password'
                      name='password'
                      value={values.password}
                      {...getFieldProps('password')}
                      placeholder='Enter password'
                      inputProps={{ maxLength: 100 }}
                      type={showPassword ? 'text' : 'password'}
                      error={Boolean(touched.password && errors.password)}
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
                    />
                    <FormHelperText error={Boolean(touched.password && errors.password)} sx={{ marginLeft: 0 }}>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
                    <TextField
                      fullWidth
                      name='confirmPassword'
                      id='confirmPassword'
                      value={values.confirmPassword}
                      {...getFieldProps('confirmPassword')}
                      inputProps={{ maxLength: 100 }}
                      placeholder='Enter confirm password'
                      type={showPassword ? 'text' : 'password'}
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    />
                    <FormHelperText error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ marginLeft: 0 }}>
                      {touched.confirmPassword && errors.confirmPassword}
                    </FormHelperText>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item lg={12} xl={12}>
                  <Stack direction='row' spacing={2}>
                    <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ width: '80px' }}>
                      Save
                    </LoadingButton>
                    <Button disabled={isLoading} color='error' onClick={onCancel} variant='outlined' sx={{ width: '80px' }}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
};

ResetAdminPassword.propTypes = {
  onCancel: PropTypes.func
};

export default ResetAdminPassword;
