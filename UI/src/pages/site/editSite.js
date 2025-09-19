import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControl,
  FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField
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
  storeIdentifier: Yup.number().required('Identifier is required.'),
  flavourId: Yup.number().required('Flavour is required.'),
  siteName: Yup.string().required('Site Name is required.').max(100, 'Site Name must be at most 100 characters.'),
  tradingName: Yup.string().required('Trading Name is required.').max(100, 'Trading Name must be at most 100 characters.'),
  addressLine1: Yup.string().required('Address Line 1 is required.').max(100, 'Address Line 1 must be at most 100 characters.'),
  addressLine2: Yup.string().max(100, 'Address Line 2 must be at most 100 characters.').nullable(),
  city: Yup.string().required('City is required.'),
  state: Yup.string().required('State is required.'),
  postal: Yup.number().required('Postal is required.'),
  latitude: Yup.number().typeError('Latitude must be a numerical.').required('Latitude is required.'),
  longitude: Yup.number().typeError('Longitude must be a numerical.').required('Longitude is required.'),
  voicePhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Voice Phone must be exactly 10 digits.')
    .test('startsWithZero', 'Voice Phone must start with 0.', (value) => {
      if (value) {
        return value.charAt(0) === '0';
      }
      return true;
    })
    .required('Voice Phone is required.'),
  abn: Yup.string().nullable(),
  email: Yup.string().max(100).email('Email Address must be a valid email address.').nullable(),
  supportedOrderModes: Yup.array().min(1, 'Atleast select one order mode.'),
  supportedMealSize: Yup.array().min(1, 'Atleast select one meal size.'),
  supportedDevice: Yup.array().min(1, 'Atleast select one device.'),
  markupPercent: Yup.number()
    .typeError('Markup Percent must be a number.')
    .min(0, 'Markup Percent must be at least 0.')
    .max(100, 'Markup Percent must be at most 100.'),
  preparationTime: Yup.number()
    .typeError('Preparation time must be a number.')
    .positive('Preparation time must be a positive number.')
    .max(60, 'Preparation time cannot exceed 60 minutes.')
    .required('Preparation time is required.'),
});

const EditSite = ({ isOpen, handleClose, siteDetails, onSave }) => {
  const [isLoading, setLoading] = useState(false);
  const [flavours, setFlavours] = useState(null);
  const { flavour } = useSelector((state) => state.auth);

  useEffect(() => {
    getFlavours();
  }, [])

  const formik = useFormik({
    initialValues: {
      storeIdentifier: siteDetails && siteDetails.storeIdentifier ? siteDetails.storeIdentifier : '',
      flavourId: siteDetails && siteDetails.flavourId ? siteDetails.flavourId : '',
      siteName: siteDetails && siteDetails.siteName ? siteDetails.siteName : '',
      tradingName: siteDetails && siteDetails.tradingName ? siteDetails.tradingName : '',
      voicePhone: siteDetails && siteDetails.voicePhone ? siteDetails.voicePhone : '',
      email: siteDetails && siteDetails.email ? siteDetails.email : '',
      addressLine1: siteDetails && siteDetails.addressLine1 ? siteDetails.addressLine1 : '',
      addressLine2: siteDetails && siteDetails.addressLine2 ? siteDetails.addressLine2 : '',
      city: siteDetails && siteDetails.city ? siteDetails.city : '',
      postal: siteDetails && siteDetails.postal ? siteDetails.postal : '',
      state: siteDetails && siteDetails.state ? siteDetails.state : '',
      latitude: siteDetails && siteDetails.latitude ? siteDetails.latitude : '',
      longitude: siteDetails && siteDetails.longitude ? siteDetails.longitude : '',
      abn: siteDetails && siteDetails.abn ? siteDetails.abn : '',
      supportedOrderModes: siteDetails && siteDetails.supportedOrderModes ? siteDetails.supportedOrderModes.split(',') : [],
      supportedMealSize: siteDetails && siteDetails.supportedMealSize ? siteDetails.supportedMealSize.split(',') : [],
      supportedDevice: siteDetails && siteDetails.supportedDevice ? siteDetails.supportedDevice.split(',') : [],
      markupPercent: siteDetails && siteDetails.markupPercent ? siteDetails.markupPercent : '',
      isBreakfast: siteDetails && siteDetails.isBreakfast ? siteDetails.isBreakfast : '',
      preparationTime: siteDetails && siteDetails.preparationTime ? siteDetails.preparationTime : 5,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        storeIdentifier: values.storeIdentifier,
        flavourId: values.flavourId,
        siteName: values.siteName,
        tradingName: values.tradingName,
        voicePhone: values.voicePhone,
        email: values.email,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postal: values.postal,
        state: values.state,
        latitude: values.latitude,
        longitude: values.longitude,
        abn: values.abn,
        supportedOrderModes: values.supportedOrderModes.join(','),
        supportedMealSize: values.supportedMealSize.join(','),
        supportedDevice: values.supportedDevice.join(','),
        markupPercent: values.markupPercent,
        isBreakfast: values.isBreakfast,
        preparationTime: values.preparationTime
      };
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

  const getFlavours = async () => {
    const { data } = await ApiService.getFlavoursAsync();
    if (data) {
      setFlavours(data);
    }
  }

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

  const orderModeOptions = formik.values.supportedOrderModes.map((mode) => ({ value: mode, title: mode }));

  const MealSizeOptions = formik.values.supportedMealSize.map((size) => ({ value: size, title: size }));

  const supportedDevicesOptions = Object.entries(enums.supportedDevices).map(([key, value]) => ({ key, value }));

  const deviceOption = supportedDevicesOptions.filter((option) => formik.values.supportedDevice.includes(option.value));

  return (
    <Dialog maxWidth='md' open={isOpen} fullWidth={true}>
      <MainCard title={siteDetails && siteDetails.siteName ? `Edit ${siteDetails.siteName}` : "Add Site"} content={false}>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <DialogContent>
                <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Flavour</InputLabel>
                      <FormControl fullWidth error={Boolean(formik.touched.flavourId && formik.errors.flavourId)}>
                        <Select
                          id="flavourId"
                          name="flavourId"
                          value={formik.values.flavourId}
                          onChange={formik.handleChange}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            <em>Select a Flavour</em>
                          </MenuItem>
                          {flavours && flavours.map((flavour) => (
                            <MenuItem key={flavour.flavourId} value={flavour.flavourId}>
                              {flavour.flavourName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={Boolean(formik.touched.flavourId && formik.errors.flavourId)} sx={{ marginLeft: 0 }}>
                          {formik.touched.flavourId && formik.errors.flavourId}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={3}>
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
                  </Grid>
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
                      <InputLabel sx={{ marginBottom: 0.7 }}>Trading Name</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='tradingName'
                          name='tradingName'
                          placeholder='Enter Trading Name'
                          value={formik.values.tradingName || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.tradingName && formik.errors.tradingName)}
                        />
                        <FormHelperText error={Boolean(formik.touched.tradingName && formik.errors.tradingName)} sx={{ marginLeft: 0 }}>
                          {formik.touched.tradingName && formik.errors.tradingName}
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
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>ABN</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='abn'
                          name='abn'
                          placeholder='Enter ABN'
                          value={formik.values.abn || ''}
                          inputProps={{ maxLength: 15 }}
                          onChange={formik.handleChange}
                          onKeyDown={utils.handleNumericKey}
                          error={Boolean(formik.touched.abn && formik.errors.abn)}
                        />
                        <FormHelperText error={Boolean(formik.touched.abn && formik.errors.abn)} sx={{ marginLeft: 0 }}>
                          {formik.touched.abn && formik.errors.abn}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Voice Phone</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='voicePhone'
                          name='voicePhone'
                          placeholder='Enter Voice Phone'
                          value={formik.values.voicePhone || ''}
                          inputProps={{ maxLength: 10 }}
                          onChange={formik.handleChange}
                          onKeyDown={utils.handleNumericKey}
                          error={Boolean(formik.touched.voicePhone && formik.errors.voicePhone)}
                        />
                        <FormHelperText error={Boolean(formik.touched.voicePhone && formik.errors.voicePhone)} sx={{ marginLeft: 0 }}>
                          {formik.touched.voicePhone && formik.errors.voicePhone}
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
                  <Grid item xs={12} sm={6}>
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
                  </Grid>
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
                      <Grid item xs={12} sm={10}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>Preparation Time</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='preparationTime'
                              name='preparationTime'
                              placeholder='Enter Preparation Time'
                              value={formik.values.preparationTime}
                              onChange={formik.handleChange}
                              onKeyDown={utils.handleNumericKey}
                              error={Boolean(formik.touched.preparationTime && formik.errors.preparationTime)}
                            />
                            <FormHelperText
                              error={Boolean(formik.touched.preparationTime && formik.errors.preparationTime)}
                              sx={{ marginLeft: 0 }}
                            >
                              {formik.touched.preparationTime && formik.errors.preparationTime}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <InputLabel>Breakfast</InputLabel>
                        <Stack spacing={2}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch
                                  id='isBreakfast'
                                  name='isBreakfast'
                                  checked={formik.values.isBreakfast}
                                  onChange={(e) => formik.setFieldValue('isBreakfast', e.target.checked)}
                                />
                              }
                            />
                          </FormGroup>
                        </Stack>
                      </Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction={'row'} spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>Latitude</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='latitude'
                              name='latitude'
                              placeholder='Enter Latitude'
                              value={formik.values.latitude || ''}
                              inputProps={{ maxLength: 25 }}
                              onChange={formik.handleChange}
                              onKeyDown={utils.handleNumericKey}
                              error={Boolean(formik.touched.latitude && formik.errors.latitude)}
                            />
                            <FormHelperText error={Boolean(formik.touched.latitude && formik.errors.latitude)} sx={{ marginLeft: 0 }}>
                              {formik.touched.latitude && formik.errors.latitude}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>Longitude</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='longitude'
                              name='longitude'
                              placeholder='Enter Longitude'
                              value={formik.values.longitude || ''}
                              inputProps={{ maxLength: 25 }}
                              onChange={formik.handleChange}
                              onKeyDown={utils.handleNumericKey}
                              error={Boolean(formik.touched.longitude && formik.errors.longitude)}
                            />
                            <FormHelperText error={Boolean(formik.touched.longitude && formik.errors.longitude)} sx={{ marginLeft: 0 }}>
                              {formik.touched.longitude && formik.errors.longitude}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Supported Order Modes</InputLabel>
                      <Autocomplete
                        multiple
                        fullWidth
                        id='supportedOrderModes'
                        name='supportedOrderModes'
                        options={enums.OrderModes.map((mode) => ({ value: mode, title: mode }))}
                        value={orderModeOptions || null}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        getOptionSelected={(option, value) => option.value === value.value}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            'supportedOrderModes',
                            newValue.map((option) => option.value)
                          );
                        }}
                        renderOption={(props, orderModeOption, { selected }) => {
                          return (
                            <li {...props} key={orderModeOption.value}>
                              <Checkbox icon={<CheckBoxOutlineBlankIcon />} checkedIcon={<CheckBoxIcon />} checked={selected} />
                              {orderModeOption.title}
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField {...params} error={Boolean(formik.touched.supportedOrderModes && formik.errors.supportedOrderModes)} />
                        )}
                      />
                      <FormHelperText error={Boolean(formik.touched.supportedOrderModes && formik.errors.supportedOrderModes)}>
                        {formik.touched.supportedOrderModes && formik.errors.supportedOrderModes}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Supported Meal Sizes</InputLabel>
                      <Autocomplete
                        multiple
                        fullWidth
                        id='supportedMealSize'
                        name='supportedMealSize'
                        options={enums.MealSize.map((size) => ({ value: size, title: size }))}
                        value={MealSizeOptions || null}
                        getOptionLabel={(option) => enums.ComboSize[option.title]}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        getOptionSelected={(option, value) => option.value === value.value}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            'supportedMealSize',
                            newValue.map((option) => option.value)
                          );
                        }}
                        renderOption={(props, mealSizeOption, { selected }) => {
                          return (
                            <li {...props} key={mealSizeOption.value}>
                              <Checkbox icon={<CheckBoxOutlineBlankIcon />} checkedIcon={<CheckBoxIcon />} checked={selected} />
                              {enums.ComboSize[mealSizeOption.title]}
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField {...params} error={Boolean(formik.touched.supportedMealSize && formik.errors.supportedMealSize)} />
                        )}
                      />
                      <FormHelperText error={Boolean(formik.touched.supportedMealSize && formik.errors.supportedMealSize)}>
                        {formik.touched.supportedMealSize && formik.errors.supportedMealSize}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Supported Device</InputLabel>
                      <Autocomplete
                        multiple
                        fullWidth
                        id="supportedDevice"
                        name="supportedDevice"
                        options={supportedDevicesOptions}
                        value={deviceOption}
                        getOptionLabel={(option) => option.key}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            'supportedDevice',
                            newValue.map((option) => option.value)
                          );
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} key={option.key}>
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                              checked={selected}
                            />
                            {option.key}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.touched.supportedDevice && formik.errors.supportedDevice)}
                          />
                        )}
                      />
                      <FormHelperText error={Boolean(formik.touched.supportedDevice && formik.errors.supportedDevice)}>
                        {formik.touched.supportedDevice && formik.errors.supportedDevice}
                      </FormHelperText>
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

export default EditSite;
