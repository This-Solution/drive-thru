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
  siteId: Yup.number().required('Site is required.'),
  cameraName: Yup.string().required('Camera Name is required.').max(100, 'Camera Name must be at most 100 characters.'),
  reloadTime: Yup.string().required('Reload Time is required.'),
  cameraType: Yup.string().required('Camera Type is required.'),
});

const AddEditCamera = ({ isOpen, handleClose, siteDetails, onSave }) => {
  const [isLoading, setLoading] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [sites, setSites] = useState([]);
  const { tenants } = useSelector((state) => state.lookup);

  useEffect(() => {
    if (selectedTenant)
      getSitesByTenantId(selectedTenant);
  }, [selectedTenant])

  const formik = useFormik({
    initialValues: {
      tenantId: siteDetails && siteDetails.tenantId ? siteDetails.tenantId : '',
      siteId: siteDetails && siteDetails.siteId ? siteDetails.siteId : '',
      cameraName: siteDetails && siteDetails.cameraName ? siteDetails.cameraName : '',
      cameraType: siteDetails && siteDetails.cameraType ? siteDetails.cameraType : '',
      cameraIpAddress: siteDetails && siteDetails.cameraIpAddress ? siteDetails.cameraIpAddress : '',
      orderIpAddress: siteDetails && siteDetails.orderIpAddress ? siteDetails.orderIpAddress : '',
      reloadTime: siteDetails && siteDetails.reloadTime ? siteDetails.reloadTime : '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        tenantId: values.tenantId,
        siteId: values.siteId,
        cameraName: values.cameraName,
        cameraType: values.cameraType,
        cameraIpAddress: values.cameraIpAddress,
        orderIpAddress: values.orderIpAddress,
        reloadTime: values.reloadTime,
      };

      console.log(payload)
      const { data, error } = siteDetails ? await ApiService.updateSiteAsync(siteDetails.siteId, payload)
        : await ApiService.saveCameraAsync(payload);
      if (data) {
        onSaveSite({ ...siteDetails, ...payload });
      } else if (error) {
        formik.setErrors(error);
      }
      setLoading(false);
    }
  });


  const getSitesByTenantId = async (tenantId) => {
    const { data } = await ApiService.getSitesByTenantIdAsync(tenantId);
    if (data) {
      setSites(data);
    }
  }

  const handleTenant = (tenantId) => {
    if (tenantId) {
      setSelectedTenant(tenantId)
      formik.setFieldValue('tenantId', tenantId)
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

  return (
    <Dialog maxWidth='md' open={isOpen} fullWidth={true}>
      <MainCard title={siteDetails && siteDetails.siteName ? `Edit ${siteDetails.siteName}` : 'Add Tenant'} content={false}>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <DialogContent>
                <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Tenant</InputLabel>
                      <FormControl fullWidth error={Boolean(formik.touched.tenantId && formik.errors.tenantId)}>
                        <Select id='tenantId' name='tenantId' value={formik.values.tenantId} onChange={(e) => handleTenant(e.target.value)} displayEmpty>
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
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Sites</InputLabel>
                      <FormControl fullWidth error={Boolean(formik.touched.siteId && formik.errors.siteId)}>
                        <Select id='siteId' name='siteId' value={formik.values.siteId} onChange={formik.handleChange} displayEmpty>
                          <MenuItem value='' disabled>
                            <em>Select a Sites</em>
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
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Camera Name</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='cameraName'
                          name='cameraName'
                          placeholder='Enter camera Name'
                          value={formik.values.cameraName || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.cameraName && formik.errors.cameraName)}
                        />
                        <FormHelperText error={Boolean(formik.touched.cameraName && formik.errors.cameraName)} sx={{ marginLeft: 0 }}>
                          {formik.touched.cameraName && formik.errors.cameraName}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Camera Type</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='cameraType'
                          name='cameraType'
                          placeholder='Enter camera Type'
                          value={formik.values.cameraType || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.cameraType && formik.errors.cameraType)}
                        />
                        <FormHelperText error={Boolean(formik.touched.cameraType && formik.errors.cameraType)} sx={{ marginLeft: 0 }}>
                          {formik.touched.cameraType && formik.errors.cameraType}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Camera Ip Address</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='cameraIpAddress'
                          name='cameraIpAddress'
                          placeholder='Enter Camera Ip Address'
                          value={formik.values.cameraIpAddress || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.cameraIpAddress && formik.errors.cameraIpAddress)}
                        />
                        {/* <FormHelperText error={Boolean(formik.touched.cameraIpAddress && formik.errors.cameraIpAddress)} sx={{ marginLeft: 0 }}>
                          {formik.touched.cameraIpAddress && formik.errors.cameraIpAddress}
                        </FormHelperText> */}
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Order Ip Address</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='orderIpAddress'
                          name='orderIpAddress'
                          placeholder='Enter order Ip Address'
                          value={formik.values.orderIpAddress || ''}
                          onChange={formik.handleChange}
                          inputProps={{ maxLength: 100 }}
                          error={Boolean(formik.touched.orderIpAddress && formik.errors.orderIpAddress)}
                        />
                        {/* <FormHelperText error={Boolean(formik.touched.orderIpAddress && formik.errors.orderIpAddress)} sx={{ marginLeft: 0 }}>
                          {formik.touched.orderIpAddress && formik.errors.orderIpAddress}
                        </FormHelperText> */}
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction={'row'} spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ marginBottom: 0.7 }}>Reload Time (in Second)</InputLabel>
                          <FormControl>
                            <TextField
                              fullWidth
                              id='reloadTime'
                              name='reloadTime'
                              placeholder='Enter reload Time'
                              value={formik.values.reloadTime || ''}
                              onChange={formik.handleChange}
                              error={Boolean(formik.touched.reloadTime && formik.errors.reloadTime)}
                            />
                            <FormHelperText error={Boolean(formik.touched.reloadTime && formik.errors.reloadTime)} sx={{ marginLeft: 0 }}>
                              {formik.touched.reloadTime && formik.errors.reloadTime}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>description</InputLabel>
                      <FormControl>
                        <TextField
                          fullWidth
                          id='description'
                          name='description'
                          placeholder='Enter description'
                          value={formik.values.description || ''}
                          inputProps={{ maxLength: 4 }}
                          onKeyDown={utils.handleNumericKey}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.description && formik.errors.description)}
                        />
                        {/* <FormHelperText error={Boolean(formik.touched.description && formik.errors.description)} sx={{ marginLeft: 0 }}>
                              {formik.touched.description && formik.errors.description}
                            </FormHelperText> */}
                      </FormControl>
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






