import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import MainCard from 'components/MainCard';
import google_place_api from 'config.js';
import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useSelector } from 'react-redux';
import ApiService from 'service/ApiService';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import enums from 'utils/enums';
import utils from 'utils/utils';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  // storeIdentifier: Yup.number().required('Identifier is required.'),
  tenantId: Yup.number().required('Tenant is required.'),
  siteName: Yup.string().required('Site Name is required.').max(100, 'Site Name must be at most 100 characters.'),
  addressLine1: Yup.string().required('Address Line 1 is required.').max(100, 'Address Line 1 must be at most 100 characters.'),
  addressLine2: Yup.string().max(100, 'Address Line 2 must be at most 100 characters.').nullable(),
  city: Yup.string().required('City is required.'),
  state: Yup.string().required('State is required.'),
  postal: Yup.number().required('Postal is required.')
});

const AddEditCamera = ({ isOpen, handleClose, siteDetails, onSave }) => {
  const [isLoading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const { flavour } = useSelector((state) => state.auth);

  useEffect(() => {
    getTenants();
  }, []);

  const formik = useFormik({
    initialValues: {
      tenantId: siteDetails && siteDetails.tenantId ? siteDetails.tenantId : '',
      siteName: siteDetails && siteDetails.siteName ? siteDetails.siteName : '',
      email: siteDetails && siteDetails.email ? siteDetails.email : '',
      addressLine1: siteDetails && siteDetails.addressLine1 ? siteDetails.addressLine1 : '',
      addressLine2: siteDetails && siteDetails.addressLine2 ? siteDetails.addressLine2 : '',
      city: siteDetails && siteDetails.city ? siteDetails.city : '',
      postal: siteDetails && siteDetails.postal ? siteDetails.postal : '',
      state: siteDetails && siteDetails.state ? siteDetails.state : ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        // storeIdentifier: values.storeIdentifier,
        tenantId: values.tenantId,
        siteName: values.siteName,
        // tradingName: values.tradingName,
        // voicePhone: values.voicePhone,
        // email: values.email,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postal: values.postal,
        state: values.state
        // abn: values.abn,
        // supportedOrderModes: values.supportedOrderModes.join(','),
        // supportedMealSize: values.supportedMealSize.join(','),
        // supportedDevice: values.supportedDevice.join(','),
        // markupPercent: values.markupPercent,
        // isBreakfast: values.isBreakfast,
        // preparationTime: values.preparationTime
      };

      console.log(payload);
      const { data, error } = siteDetails ? await ApiService.updateSiteAsync(siteDetails.siteId, payload)
        : await ApiService.addSiteAsync(payload);
      if (data) {
        onSaveSite({ ...siteDetails, ...payload });
      } else if (error) {
        formik.setErrors(error);
      }
      setLoading(false);
    }
  });

  const getTenants = async () => {
    const { data } = await ApiService.getTenantsAsync();
    if (data) {
      setTenants(data);
    }
  };

  const onSaveSite = async (site) => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Site updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    setLoading(false);
    onSave(site);
  };

  const onPlaceChange = async (placeDetail) => {
    if (!placeDetail) {
      return;
    }

    const addressComponents = {
      streetName: '',
      addressLine1: '',
      city: '',
      state: '',
      postal: '',
      latitude: '',
      longitude: ''
    };

    const geocoder = new window.google.maps.Geocoder();
    const placeId = placeDetail.value.place_id;
    const geocoderResponse = await geocoder.geocode({ placeId });

    _.map(geocoderResponse.results, (item) => {
      _.map(item.address_components, (address) => {
        if (address.types.includes('premise')) {
          addressComponents.addressLine1 = address.short_name;
        } else if (address.types.includes('subpremise')) {
          addressComponents.addressLine1 = addressComponents.addressLine1 ? addressComponents.addressLine1 : address.short_name;
        } else if (address.types.includes('street_number')) {
          addressComponents.addressLine1 = addressComponents.addressLine1
            ? addressComponents.addressLine1 + '-' + address.long_name
            : address.long_name;
        } else if (address.types.includes('route')) {
          addressComponents.addressLine1 = addressComponents.addressLine1
            ? addressComponents.addressLine1 + ' ' + address.long_name
            : address.long_name;
        } else if (address.types.includes('sublocality')) {
          addressComponents.city = address.short_name;
        } else if (address.types.includes('locality') && !address.city) {
          addressComponents.city = address.short_name;
        } else if (address.types.includes('administrative_area_level_1')) {
          addressComponents.state = address.short_name;
        } else if (address.types.includes('postal_code')) {
          addressComponents.postal = address.short_name;
        }
      });
      addressComponents.latitude = item.geometry.location.lat();
      addressComponents.longitude = item.geometry.location.lng();
    });

    formik.setValues({
      ...formik.values,
      addressLine1: addressComponents.addressLine1,
      city: addressComponents.city,
      state: addressComponents.state,
      postal: addressComponents.postal,
      latitude: addressComponents.latitude,
      longitude: addressComponents.longitude
    });
  };

  return (
    <Dialog maxWidth='md' open={isOpen} fullWidth={true}>
      <MainCard title={siteDetails && siteDetails.siteName ? `Edit ${siteDetails.siteName}` : 'Add Tenant'} content={false}>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <DialogContent>
                <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Tenant</InputLabel>
                      <FormControl fullWidth error={Boolean(formik.touched.tenantId && formik.errors.tenantId)}>
                        <Select id='tenantId' name='tenantId' value={formik.values.tenantId} onChange={formik.handleChange} displayEmpty>
                          <MenuItem value='' disabled>
                            <em>Select a Tenant</em>
                          </MenuItem>
                          {tenants &&
                            tenants.map((tenant) => (
                              <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                                {tenant.tenantName}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText error={Boolean(formik.touched.tenantId && formik.errors.tenantId)} sx={{ marginLeft: 0 }}>
                          {formik.touched.tenantId && formik.errors.tenantId}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  {/* <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Identifier</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='storeIdentifier'
                          name='storeIdentifier'
                          onKeyDown={utils.handleNumericKey}
                          placeholder='Enter Identifier'
                          disabled={siteDetails}
                          value={formik.values.storeIdentifier || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 6 }}
                          error={Boolean(formik.touched.storeIdentifier && formik.errors.storeIdentifier)}
                        />
                        <FormHelperText error={Boolean(formik.touched.storeIdentifier && formik.errors.storeIdentifier)} sx={{ marginLeft: 0 }}>
                          {formik.touched.storeIdentifier && formik.errors.storeIdentifier}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Search Location</InputLabel>
                      <GooglePlacesAutocomplete
                        apiKey={google_place_api.api_key}
                        minLengthAutocomplete={3}
                        autocompletionRequest={{
                          componentRestrictions: {
                            country: 'au'
                          }
                        }}
                        selectProps={{
                          // value: defaultValue ?? { label: defaultValue, value: defaultValue },
                          isClearable: true,
                          onChange: onPlaceChange,
                          noOptionsMessage: () => 'No Locations available',
                          placeholder: 'Search Location'
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Site Name</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='siteName'
                          name='siteName'
                          placeholder='Enter Site Name'
                          value={formik.values.siteName || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.siteName && formik.errors.siteName)}
                        />
                        <FormHelperText error={Boolean(formik.touched.siteName && formik.errors.siteName)} sx={{ marginLeft: 0 }}>
                          {formik.touched.siteName && formik.errors.siteName}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Address Line 1</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='addressLine1'
                          name='addressLine1'
                          placeholder='Enter Address Line 1'
                          value={formik.values.addressLine1 || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.addressLine1 && formik.errors.addressLine1)}
                        />
                        <FormHelperText error={Boolean(formik.touched.addressLine1 && formik.errors.addressLine1)} sx={{ marginLeft: 0 }}>
                          {formik.touched.addressLine1 && formik.errors.addressLine1}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Address Line 2</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='addressLine2'
                          name='addressLine2'
                          placeholder='Enter Address Line 2'
                          value={formik.values.addressLine2 || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.addressLine2 && formik.errors.addressLine2)}
                        />
                        <FormHelperText error={Boolean(formik.touched.addressLine2 && formik.errors.addressLine2)} sx={{ marginLeft: 0 }}>
                          {formik.touched.addressLine2 && formik.errors.addressLine2}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>City</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='city'
                          name='city'
                          placeholder='Enter City'
                          value={formik.values.city || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.city && formik.errors.city)}
                        />
                        <FormHelperText error={Boolean(formik.touched.city && formik.errors.city)} sx={{ marginLeft: 0 }}>
                          {formik.touched.city && formik.errors.city}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Email Address</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='email'
                          name='email'
                          placeholder='Enter Email Address'
                          value={formik.values.email || ''}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.email && formik.errors.email)}
                        />
                        <FormHelperText error={Boolean(formik.touched.email && formik.errors.email)} sx={{ marginLeft: 0 }}>
                          {formik.touched.email && formik.errors.email}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction={'row'} spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>State</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='state'
                              name='state'
                              placeholder='Enter State'
                              value={formik.values.state || ''}
                              onChange={formik.handleChange}
                              error={Boolean(formik.touched.state && formik.errors.state)}
                            />
                            <FormHelperText error={Boolean(formik.touched.state && formik.errors.state)} sx={{ marginLeft: 0 }}>
                              {formik.touched.state && formik.errors.state}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>Postal</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='postal'
                              name='postal'
                              placeholder='Enter Postal'
                              value={formik.values.postal || ''}
                              inputProps={{ maxLength: 4 }}
                              onKeyDown={utils.handleNumericKey}
                              onChange={formik.handleChange}
                              error={Boolean(formik.touched.postal && formik.errors.postal)}
                            />
                            <FormHelperText error={Boolean(formik.touched.postal && formik.errors.postal)} sx={{ marginLeft: 0 }}>
                              {formik.touched.postal && formik.errors.postal}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction={'row'} spacing={2}>
                      {flavour && flavour.isExternal && (
                        <Grid item xs={12} sm={10}>
                          <Stack spacing={1}>
                            <InputLabel sx={{ marginBottom: 0.7 }}>Markup Percent</InputLabel>
                            <FormControl>
                              <TextField
                                fullWidth
                                id='markupPercent'
                                name='markupPercent'
                                placeholder='Enter Markup Percent'
                                value={formik.values.markupPercent}
                                inputProps={{ maxLength: 5 }}
                                onChange={formik.handleChange}
                                onKeyDown={utils.handleNumericKey}
                              />
                              <FormHelperText
                                error={Boolean(formik.touched.markupPercent && formik.errors.markupPercent)}
                                sx={{ marginLeft: 0 }}
                              >
                                {formik.touched.markupPercent && formik.errors.markupPercent}
                              </FormHelperText>
                            </FormControl>
                          </Stack>
                        </Grid>
                      )}

                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
            </Box>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item lg={12} xl={12}>
                  <Stack spacing={2} alignItems='start' direction='row'>
                    <LoadingButton
                      loading={isLoading}
                      disabled={formik.isSubmitting}
                      sx={{ width: '80px' }}
                      type='submit'
                      color='primary'
                      variant='contained'
                    >
                      Save
                    </LoadingButton>
                    <Button sx={{ width: '80px' }} onClick={handleClose} color='error' variant='outlined'>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </FormikProvider>
      </MainCard>
    </Dialog>
  );
};

export default AddEditCamera;






