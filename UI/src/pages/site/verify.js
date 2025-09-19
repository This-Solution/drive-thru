import { CloseOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { useEffect, useState } from 'react';
import ApiService from 'service/ApiService';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const Verify = ({ isOpen, handleClose, siteDetails }) => {
  const [isLoading, setLoading] = useState(false);
  const [tyroLocationId, setTyroLocationId] = useState('');
  const [uberSiteId, setUberSiteId] = useState('');
  const [tyroVerified, setTyroVerified] = useState(false);
  const [uberVerified, setUberVerified] = useState(false);
  const [tyroError, setTyroError] = useState(false);
  const [uberError, setUberError] = useState(false);

  useEffect(() => {
    getVerifyDetails();
  }, []);

  const getVerifyDetails = async () => {
    setLoading(true);
    const { data } = await ApiService.getVerifyDetailsAsync(siteDetails.siteId);
    setTyroLocationId(data.tyroLocationId || '');
    setUberSiteId(data.uberSiteId || '');
    setLoading(false);
  };

  const handleVerify = async (type, value) => {
    setLoading(true);
    let successMessage = '';
    let response;
    let verified = false;

    if (!value) {
      setErrorState(type, true);
      setLoading(false);
      return;
    }

    setErrorState(type, false);

    switch (type) {
      case 'tyro':
        response = await ApiService.verifyTyroAsync(siteDetails.siteId, value);
        successMessage = 'Tyro verification successful.';
        verified = response && !response.error;
        setTyroVerified(verified);
        break;
      case 'uber':
        response = await ApiService.verifyUberDeliveryAsync(siteDetails.siteId, value);
        successMessage = 'Uber verification successful.';
        verified = response && !response.error;
        setUberVerified(verified);
        break;
      default:
        break;
    }
    if (response.error) {
      const errorMessage = response.error.msg || response.error.cart || 'Verification failed.';
      showSnackbar(errorMessage, 'error');
      setLoading(false);
    } else if (response && response.data) {
      showSnackbar(successMessage, 'success');
    }
    setLoading(false);
  };

  const setErrorState = (type, error) => {
    switch (type) {
      case 'tyro':
        setTyroError(error);
        break;
      case 'uber':
        setUberError(error);
        break;
      default:
        break;
    }
  };

  const showSnackbar = (message, color) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: { color },
        close: true
      })
    );
  };

  const saveDetailSnackbar = (message, color) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: { color },
        close: true
      })
    );
  };

  const handleTyroChange = (event) => {
    setTyroLocationId(event.target.value);
    setTyroVerified(false);
    setTyroError(false);
  };

  const handleUberChange = (event) => {
    setUberSiteId(event.target.value);
    setUberVerified(false);
    setUberError(false);
  };

  const handleSave = async (type, value) => {
    await ApiService.saveVerifyDetailAsync({ type, value }, siteDetails.siteId);
    saveDetailSnackbar('Verify detail saved successfully.', 'success');
  };

  return (
    <Dialog maxWidth='xs' fullWidth open={isOpen}>
      <DialogTitle>
        {`Verify - ${siteDetails.siteName}`}
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            mb: 'px',
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      <Divider />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <InputLabel sx={{ mb: 0.7 }}>Tyro</InputLabel>
              <Stack spacing={2} direction={'row'}>
                <FormControl>
                  <TextField
                    id='tyroLocationId'
                    size='large'
                    name='tyroLocationId'
                    value={tyroLocationId}
                    onChange={handleTyroChange}
                    error={tyroError}
                  />
                  <FormHelperText error={tyroError} sx={{ marginLeft: 0 }}>
                    {tyroError && 'Tyro location id is required.'}
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <LoadingButton
                    variant='contained'
                    size='small'
                    sx={{ height: '45px' }}
                    onClick={() => handleVerify('tyro', tyroLocationId)}
                    loading={isLoading}
                  >
                    Verify
                  </LoadingButton>
                </FormControl>
                {tyroVerified && (
                  <Button size='small' onClick={() => handleSave('tyro', tyroLocationId)} color='primary' variant='outlined'>
                    Save
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel sx={{ mb: 0.7 }}>Uber</InputLabel>
              <Stack spacing={2} direction={'row'}>
                <FormControl>
                  <TextField
                    id='uberSiteId'
                    size='large'
                    name='uberSiteId'
                    value={uberSiteId}
                    onChange={handleUberChange}
                    error={uberError}
                  />
                  <FormHelperText error={uberError} sx={{ marginLeft: 0 }}>
                    {uberError && 'Uber site id is required.'}
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <LoadingButton
                    size='small'
                    sx={{ height: '45px' }}
                    variant='contained'
                    onClick={() => handleVerify('uber', uberSiteId)}
                    loading={isLoading}
                  >
                    Verify
                  </LoadingButton>
                </FormControl>
                {uberVerified && (
                  <Button size='small' onClick={() => handleSave('uber', uberSiteId)} color='primary' variant='outlined'>
                    Save
                  </Button>
                )}
              </Stack>
            </Grid>
            {/* <Grid item xs={12} sm={12}>
                                <InputLabel sx={{ mb: 0.7 }}>DoorDash</InputLabel>
                                <Stack spacing={2} direction={'row'}>
                                    <FormControl>
                                        <TextField
                                            id="doorDashSiteId"
                                           size="large"
                                            name="doorDashSiteId"
                                            value={doorDashSiteId}
                                            onChange={handleDoorDashChange}
                                            error={doorDashError}
                                        />
                                        <FormHelperText error={doorDashError} sx={{ marginLeft: 0 }}>
                                            {doorDashError && "DoorDash site id is required."}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <LoadingButton
                                            variant="contained"
                                            size="small"
                                             sx={{ height: '45px' }}
                                            onClick={() => handleVerify('doordash', doorDashSiteId)}
                                            loading={isLoading}
                                        >
                                            Verify
                                        </LoadingButton>
                                    </FormControl>
                                    {doorDashVerified && (

                                    <Button  size="small"
                                        onClick={() => handleSave('doordash', doorDashSiteId)} color="primary" variant="outlined">
                                        Save
                                    </Button>
                                        )}
                                </Stack>
                            </Grid> */}
          </Grid>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Verify;
