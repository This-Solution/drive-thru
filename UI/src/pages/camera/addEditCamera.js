import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import MainCard from 'components/MainCard';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiService from 'service/ApiService';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import enums from 'utils/enums';
import utils from 'utils/utils';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  tenantId: Yup.number().required('Tenant is required.'),
  siteId: Yup.number().required('Site is required.'),
  cameraName: Yup.string().required('Camera Name is required.').max(100, 'Camera Name must be at most 100 characters.'),
  reloadTime: Yup.string().required('Reload Time is required.'),
  cameraType: Yup.string().required('Camera Type is required.')
});

const AddEditCamera = ({ isOpen, handleClose, cameraDetails, onSave }) => {
  const [isLoading, setLoading] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [sites, setSites] = useState([]);
  const { tenants } = useSelector((state) => state.lookup);

  useEffect(() => {
    if (selectedTenant || (cameraDetails && cameraDetails.tenantId))
      getSitesByTenantId(selectedTenant ? selectedTenant : cameraDetails.tenantId);
  }, [selectedTenant, cameraDetails]);

  const formik = useFormik({
    initialValues: {
      tenantId: cameraDetails && cameraDetails.tenantId ? cameraDetails.tenantId : '',
      siteId: cameraDetails && cameraDetails.siteId ? cameraDetails.siteId : '',
      cameraName: cameraDetails && cameraDetails.cameraName ? cameraDetails.cameraName : '',
      cameraType: cameraDetails && cameraDetails.cameraType ? cameraDetails.cameraType : '',
      cameraIpAddress: cameraDetails && cameraDetails.cameraIpAddress ? cameraDetails.cameraIpAddress : '',
      orderIpAddress: cameraDetails && cameraDetails.orderIpAddress ? cameraDetails.orderIpAddress : '',
      reloadTime: cameraDetails && cameraDetails.reloadTime ? cameraDetails.reloadTime : '',
      description: cameraDetails && cameraDetails.description ? cameraDetails.description : ''
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
        description: values.description
      };

      const { data, error } = cameraDetails
        ? await ApiService.updateCameraAsync(cameraDetails.cameraId, payload)
        : await ApiService.saveCameraAsync(payload);
      if (data) {
        onSaveCamera({ ...cameraDetails, ...payload });
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
  };

  const handleTenant = (tenantId) => {
    if (tenantId) {
      setSelectedTenant(tenantId);
      formik.setFieldValue('tenantId', tenantId);
    }
  };

  const onSaveCamera = async (camera) => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Camera updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    setLoading(false);
    onSave(camera);
  };

  return (
    <Dialog maxWidth='md' open={isOpen} fullWidth={true}>
      <MainCard title={cameraDetails && cameraDetails.siteName ? `Edit ${cameraDetails.cameraName}` : 'Add Camera'} content={false}>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <DialogContent>
                <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ marginBottom: 0.7 }}>Tenants</InputLabel>
                      <FormControl fullWidth error={Boolean(formik.touched.tenantId && formik.errors.tenantId)}>
                        <Select
                          id='tenantId'
                          name='tenantId'
                          value={formik.values.tenantId}
                          onChange={(e) => handleTenant(e.target.value)}
                          displayEmpty
                        >
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
                        <Select
                          id='siteId'
                          name='siteId'
                          value={formik.values.siteId}
                          onChange={formik.handleChange}
                          displayEmpty
                          disabled={!selectedTenant && !cameraDetails}
                        >
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
                      <FormControl fullWidth error={Boolean(formik.touched.tenantId && formik.errors.tenantId)}>
                        <Select
                          id='cameraType'
                          name='cameraType'
                          value={formik.values.cameraType}
                          onChange={formik.handleChange}
                          displayEmpty
                        >
                          <MenuItem value='' disabled>
                            <em>Select a Type</em>
                          </MenuItem>
                          {Object.entries(enums.cameraType).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
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
                          <InputLabel sx={{ marginBottom: 0.7 }}>Reload Time (in Sec)</InputLabel>
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
