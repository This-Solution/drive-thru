// material-ui
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  createFilterOptions
} from '@mui/material';
import Loader from 'components/Loader';
// third-party
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
// project imports
import ApiService from 'service/ApiService';
import { openSnackbar } from 'store/reducers/snackbar';
import enums from 'utils/enums';
import utils from 'utils/utils';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

// ==============================|| Add | Edit SystemUser  ||============================== //

const UserSchema = (user, page, loggedInUserRole) => {
  const shape = {
    firstName: Yup.string().max(50).required('First Name is required.'),
    surName: Yup.string().max(50).required('Surname is required.'),
    email: Yup.string().max(100).required('Email Address is required.').email('Email address must be a valid email address.'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .test('startsWithZero', 'Phone number must start with 0', (value) => {
        if (value) {
          return value.charAt(0) === '0';
        }
        return true;
      })
      .required('Phone number is required.'),
    roleName: page === 'editProfile' ? Yup.string().notRequired() : Yup.string().required('Role is required.'),
    password: user ? Yup.string().max(100) : Yup.string().max(100).required('Password is required.'),
    siteId: Yup.number().required('Site is required.')

    // siteId: Yup.array().when(['roleName'], {
    //   is: (roleName) => ['User', 'Admin'].includes(roleName),
    //   then: Yup.array().min(1, 'Atleast select one site.'),
    //   otherwise: Yup.array().notRequired()
    // }),
  };

  return Yup.object().shape(shape);
};

const AddUser = ({ user, onCancel, onSave, page }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);
  // const [userSites, setUserSites] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const loggedInUser = useSelector((state) => state.auth.user);
  const { tenants } = useSelector((state) => state.lookup);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    getRoleList();
    getSites();
  }, []);

  // useEffect(() => {
  //   if (!page && user) {
  //     getSitesById();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   formik.setFieldValue('siteId', userSites);
  // }, [userSites]);

  const getSites = async () => {
    const { data } = await ApiService.getSitesAsync();
    setSites(data);
    setLoading(false);
  };

  const getRoleList = async () => {
    const { data } = await ApiService.getRoleListAsync();
    let userRoles;
    if (data) {
      userRoles = data.filter((role) => role.roleId >= loggedInUser.roleId);
    }
    setRoles(userRoles);
    setLoading(false);
  };

  // const getSitesById = async () => {
  //   const { data } = await ApiService.getSitesByIdAsync(user.systemUserId);
  //   setUserSites(data);
  // };

  // const filterSiteOptions = (options, params) => {
  //   const filter = createFilterOptions();
  //   const filtered = filter(options, params);
  //   return [{ siteId: 'selectAll', siteName: 'Select All' }, ...filtered];
  // };

  // const onSiteAccessChange = (newValue) => {
  //   if (newValue && newValue.some((option) => option.siteId === 'selectAll')) {
  //     formik.setFieldValue('siteId', formik.values.siteId === sites ? [] : sites);
  //   } else {
  //     formik.setFieldValue('siteId', newValue);
  //   }
  // };
  const formik = useFormik({
    initialValues: {
      firstName: page ? user.name.split(' ')[0] : user ? user.firstName : '',
      surName: page ? user.name.split(' ')[1] : user ? user.surName : '',
      email: user ? user.email : '',
      password: '',
      phone: user ? user.phone : '',
      roleName: user ? user.roleName : '',
      siteId: user ? user.siteId : '',
      tenantId: user ? user.tenantId : ''
    },

    validationSchema: UserSchema(user, page, loggedInUser.roleId),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (user) {
        await updateUser(values, user.userId, setErrors);
      } else {
        await addUser(values, setErrors);
      }
      setSubmitting(false);
    }
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, handleBlur } = formik;

  const addUser = async (values, setErrors) => {
    const selectedRole = roles.find((role) => role.roleName === values.roleName);
    if (selectedRole) {
      values.roleId = selectedRole.roleId;
    }
    const payload = {
      ...values
    };
    if (loggedInUser.roleId !== enums.userRole.SuperAdmin) {
      payload.tenantId = loggedInUser.tenantId;
    }
    payload.siteId = formik.values.siteId ? formik.values.siteId : '';
    delete payload.systemUserId;
    const { data, error } = await ApiService.addAdminAsync(payload);
    if (data) {
      await onSaveUser();
      onSave(data);
    } else if (error) {
      setErrors(error);
    }
  };

  const updateUser = async (values, systemUserId, setErrors) => {
    const selectedRole = roles.find((role) => role.roleName === values.roleName);
    values.roleId = page ? user.roleId : selectedRole.roleId;
    values.userId = systemUserId;
    const payload = {
      ...values
    };
    // const selectedSites = sites.find((site) => site.siteId === values.siteId);
    // if (selectedSites) {
    //   values.siteId = selectedSites.siteId;
    // }
    // if (payload.roleId === enums.userRole.CJAdmin || payload.roleId === enums.userRole.SuperAdmin) {
    //   payload.siteId = [];
    // } else {
    //   payload.siteId = formik.values.siteId ? formik.values.siteId.map((site) => site.siteId) : [];
    // }
    // if (payload.roleId === enums.userRole.CJAdmin || payload.roleId === enums.userRole.SuperAdmin)
    // delete payload.roleName;

    delete payload.password;
    // if (page) {
    //   localStorage.setItem('phone', payload.phone);
    // }
    const { data, error } = await ApiService.updateAdminAsync(payload, user.userId);
    if (data) {
      await onSaveUser();
      onSave(data);
    } else if (error) {
      setErrors(error);
    }
  };

  const onSaveUser = async () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'User saved successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    setLoading(false);
    onCancel();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderForm = () => {
    return (
      <Dialog maxWidth='sm' fullWidth open={true} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        <FormikProvider value={formik}>
          <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
            <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='firstName'>First Name</InputLabel>
                    <TextField
                      fullWidth
                      autoComplete='off'
                      id='firstName'
                      inputProps={{ maxLength: 50 }}
                      placeholder='Enter First Name'
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                    />
                    <FormHelperText error={Boolean(touched.firstName && errors.firstName)}>
                      {touched.firstName && errors.firstName}
                    </FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='surname'>Surname</InputLabel>
                    <TextField
                      fullWidth
                      id='surname'
                      inputProps={{ maxLength: 50 }}
                      placeholder='Enter Surname'
                      {...getFieldProps('surName')}
                      error={Boolean(touched.surName && errors.surName)}
                    />
                    <FormHelperText error={Boolean(touched.surName && errors.surName)}>{touched.surName && errors.surName}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='email'>Email Address</InputLabel>
                    <TextField
                      fullWidth
                      id='email'
                      autoComplete='new-email'
                      inputProps={{ maxLength: 100 }}
                      placeholder='Enter Email Address'
                      {...formik.getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                    />
                    <FormHelperText error={Boolean(touched.email && errors.email)}>{touched.email && errors.email}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor='phone'>Phone Number</InputLabel>
                    <TextField
                      fullWidth
                      id='phone'
                      inputProps={{ maxLength: 10 }}
                      placeholder='Enter Phone Number'
                      {...getFieldProps('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      onKeyDown={utils.handleNumericKey}
                    />
                    <FormHelperText error={Boolean(touched.phone && errors.phone)}>{touched.phone && errors.phone}</FormHelperText>
                  </Stack>
                </Grid>

                {!isSubmitting &&
                  (user ? null : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor='password'>Password</InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            id='password'
                            autoComplete='new-password'
                            inputProps={{ maxLength: 100 }}
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            name='password'
                            onBlur={(event) => {
                              handleBlur(event);
                            }}
                            onChange={formik.handleChange}
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
                            placeholder='Enter Password'
                            required={!user}
                            disabled={Boolean(user)}
                          />
                          {touched.password && errors.password && (
                            <FormHelperText error id='password'>
                              {errors.password}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    </>
                  ))}
                {page ? null : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor='roleId'>Role</InputLabel>
                        <FormControl sx={{ minWidth: '100%' }}>
                          <Select
                            id='roleId'
                            name='roleName'
                            displayEmpty
                            value={formik.values.roleName}
                            {...getFieldProps('roleName')}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value=''>
                              <em>Select Role</em>
                            </MenuItem>
                            {roles.map((role) => (
                              <MenuItem key={role.roleId} value={role.roleName}>
                                {role.roleName}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.roleName && touched.roleName && (
                            <FormHelperText error id='standard-weight-helper-text-email-login' sx={{ marginLeft: 0 }}>
                              {errors.roleName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Stack>
                    </Grid>

                    {loggedInUser.roleId === 1 && page !== 'editProfile' && (
                      <Grid item xs={12} sm={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor='roleId'>Tenant</InputLabel>
                          <FormControl sx={{ minWidth: '100%' }}>
                            <Select
                              id='tenantId'
                              name='tenantId'
                              displayEmpty
                              value={formik.values.tenantId || ''}
                              onChange={(event) => {
                                formik.setFieldValue('tenantId', Number(event.target.value));
                              }}
                              error={Boolean(touched.tenantId && errors.tenantId)}
                            >
                              <MenuItem value=''>
                                <em>Select Tenant</em>
                              </MenuItem>
                              {tenants &&
                                tenants.map((tenant) => (
                                  <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                                    {tenant.tenantName}
                                  </MenuItem>
                                ))}
                            </Select>
                            {errors.tenantId && touched.tenantId && (
                              <FormHelperText error id='tenantId' sx={{ marginLeft: 0 }}>
                                {errors.tenantId}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Stack>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={12}>
                      {/* <Stack spacing={1}>
                        {formik.values.roleName !== enums.displayAdminRole.brandCMSAdmin
                          && formik.values.roleName !== enums.displayAdminRole.superAdmin && (
                            <>
                              <InputLabel htmlFor='siteId'>Site</InputLabel>
                              <FormControl>
                                <Autocomplete
                                  multiple
                                  id='siteId'
                                  options={sites}
                                  limitTags={6}
                                  value={formik.values.siteId || userSites}
                                  disableCloseOnSelect={
                                    formik.values.siteId && formik.values.siteId.some((option) => option.siteId === 'selectAll')
                                  }
                                  getOptionLabel={(site) => site.siteName}
                                  isOptionEqualToValue={(option, value) => option.siteId === value.siteId}
                                  filterOptions={filterSiteOptions}
                                  onChange={(event, newValue) => onSiteAccessChange(newValue)}
                                  defaultValue={sites}
                                  renderOption={(props, site, { selected }) => {
                                    return (
                                      <li {...props} key={site.siteId}>
                                        <Checkbox
                                          icon={<CheckBoxOutlineBlankIcon />}
                                          checkedIcon={<CheckBoxIcon />}
                                          checked={site.siteId === 'selectAll' ? formik.values.siteId === sites : selected}
                                        />
                                        {site.siteName}
                                      </li>
                                    );
                                  }}
                                  renderInput={(sites) => <TextField {...sites} />}
                                />
                              </FormControl>
                            </>
                          )}
                        <FormHelperText error={Boolean(touched.siteId && errors.siteId)}>{touched.siteId && errors.siteId}</FormHelperText>
                      </Stack> */}
                      <Stack spacing={1}>
                        <InputLabel sx={{ marginBottom: 0.7 }}>Site</InputLabel>
                        <FormControl fullWidth error={Boolean(formik.touched.siteId && formik.errors.siteId)}>
                          <Select
                            id='siteId'
                            name='siteId'
                            value={formik.values.siteId}
                            onChange={formik.handleChange}
                            displayEmpty
                          // disabled={!selectedTenant && !cameraDetails}
                          >
                            <MenuItem value='' disabled>
                              <em>Select a Site</em>
                            </MenuItem>
                            {sites &&
                              sites.map((site) => (
                                <MenuItem key={site.siteId} value={site.siteId}>
                                  {site.siteName}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText error={Boolean(formik.touched.siteId && formik.errors.siteId)} sx={{ marginLeft: 0 }}>
                            {formik.touched.siteId && formik.errors.siteId}
                          </FormHelperText>
                        </FormControl>
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item lg={12} xl={12}>
                  <Stack direction='row' spacing={2}>
                    <Button type='submit' disabled={isSubmitting} variant='contained' sx={{ width: '80px' }}>
                      Save
                    </Button>
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
    );
  };

  return <>{isLoading ? <Loader /> : renderForm()}</>;
};

AddUser.propTypes = {
  user: PropTypes.any,
  onCancel: PropTypes.func,
  onAddEdit: PropTypes.func,
  onDeleteUser: PropTypes.func
};

export default AddUser;
