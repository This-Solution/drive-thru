import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ApiService from 'service/ApiService';
import { openSnackbar } from 'store/reducers/snackbar';
import constants from 'utils/constants';
import dateHelper from 'utils/dateHelper';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  siteHours: Yup.array().of(
    Yup.object().shape({
      openingTime: Yup.date().required('Opening time is required.').nullable(),
      closingTime: Yup.date().required('Closing time is required.').nullable()
    })
  )
});

const SiteHours = ({ siteDetails, handleClose }) => {
  const dispatch = useDispatch();
  const [timezone, setTimezone] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSiteDetails();
  }, []);

  const getSiteDetails = async () => {
    setLoading(true);
    const { data } = await ApiService.getSiteHoursAsync(siteDetails.siteId);
    if (data) {
      setTimezone(constants.refTimezones[siteDetails.state]);
      formik.setFieldValue('siteHours', data);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      siteHours: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { data, error } = await ApiService.updateSiteTimeAsync(siteDetails.siteId, values.siteHours);
      handleClose();
      if (data) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Site timings are updated successfully.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      } else if (error) {
        formik.setErrors(error);
      }
      setLoading(false);
    }
  });

  return (
    <Dialog maxWidth='sm' fullWidth open={true} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
      <DialogTitle>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <span>Site Working Time ({timezone})</span>
        </Stack>
      </DialogTitle>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day Of Week</TableCell>
                    <TableCell>Opening Time</TableCell>
                    <TableCell>Closing Time</TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} align='center'>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <FieldArray
                      name='siteHours'
                      render={() =>
                        formik.values.siteHours.map((time, index) => {
                          return (
                            <TableRow key={index}>
                              <>
                                <TableCell>{dateHelper.dayName(time.dayOfWeek)}</TableCell>
                                <TableCell>
                                  <FormControl fullWidth error={Boolean(formik.errors.siteHours?.[index]?.openingTime)}>
                                    <TimePicker
                                      id={`siteHours.${index}.openingTime`}
                                      name={`siteHours.${index}.openingTime`}
                                      timezone={timezone}
                                      value={dateHelper.convertToUtc(time.openingTime, timezone)}
                                      onChange={(newValue) => {
                                        formik.setFieldValue(`siteHours.${index}.openingTime`, newValue ? newValue : null);
                                      }}
                                      renderInput={(params) => (
                                        <TextField {...params} error={Boolean(formik.errors.siteHours?.[index]?.openingTime)} fullWidth />
                                      )}
                                    />
                                    <FormHelperText sx={{ marginLeft: 0, height: '1em' }}>
                                      {formik.errors.siteHours?.[index]?.openingTime}
                                    </FormHelperText>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth error={Boolean(formik.errors.siteHours?.[index]?.closingTime)}>
                                    <TimePicker
                                      id={`siteHours.${index}.closingTime`}
                                      name={`siteHours.${index}.closingTime`}
                                      timezone={timezone}
                                      value={dateHelper.convertToUtc(time.closingTime, timezone)}
                                      onChange={(newValue) => {
                                        formik.setFieldValue(`siteHours.${index}.closingTime`, newValue ? newValue : null);
                                      }}
                                      renderInput={(params) => (
                                        <TextField {...params} error={Boolean(formik.errors.siteHours?.[index]?.closingTime)} fullWidth />
                                      )}
                                    />
                                    <FormHelperText sx={{ marginLeft: 0, height: '1em' }}>
                                      {formik.errors.siteHours?.[index]?.closingTime}
                                    </FormHelperText>
                                  </FormControl>
                                </TableCell>
                              </>
                            </TableRow>
                          );
                        })
                      }
                    />
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, ml: 0.7 }}>
            <Grid container justifyContent='space-between' alignItems='center'>
              <Grid item lg={12} xl={12}>
                <Stack direction='row' spacing={2} alignItems='start'>
                  <Button type='submit' variant='contained' sx={{ width: '80px' }}>
                    Save
                  </Button>
                  <Button color='error' onClick={handleClose} variant='outlined' sx={{ width: '80px' }}>
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default SiteHours;
