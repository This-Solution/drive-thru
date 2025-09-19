import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, InputLabel, FormControl, Stack, FormHelperText } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import utils from 'utils/utils';
import apiService from 'service/ApiService';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

const SaveDiningTableDialog = ({ open, onClose, siteId, onSave, tabledata }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        formik.resetForm();
    }, [open]);

    const ValidationSchema = Yup.object().shape({
        tableNo: Yup.string().required('Table No is required.'),
        seatingCapacity: Yup.number().required('Seating Capacity is required.')
    });

    const formik = useFormik({
        initialValues: {
            tableNo: tabledata ? tabledata.tableNo : '',
            seatingCapacity: tabledata ? tabledata.seatingCapacity : '',
            siteId: siteId,
        },
        validationSchema: ValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            if (tabledata) {
                values.diningTableId = tabledata.diningTableId;
            }
            const { data, error } = await apiService.saveDiningTableAsync(values);
            if (data) {
                onSave(data);
                showSnackbar('Table has been saved successfully.', 'success');
                resetForm();
                onClose();
            } else if (error) {
                showSnackbar(error.table, 'error');
            }
            setSubmitting(false);
        }
    });

    const showSnackbar = (message, color) => {
        dispatch(
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                alert: { color: color },
                close: true
            })
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{tabledata ? 'Edit Dining Table' : 'Add Dining Table'}</DialogTitle>
            <Divider />
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 0.5 }}>Table No</InputLabel>
                                    <Stack spacing={2}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                id="tableNo"
                                                name="tableNo"
                                                placeholder='Enter Table No'
                                                value={formik.values.tableNo}
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.touched.tableNo && formik.errors.tableNo)}
                                            />
                                            <FormHelperText error={Boolean(formik.touched.tableNo && formik.errors.tableNo)} sx={{ marginLeft: 0 }}>
                                                {formik.touched.tableNo && formik.errors.tableNo}
                                            </FormHelperText>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 0.5 }}>Seating Capacity</InputLabel>
                                    <Stack spacing={2}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                id="seatingCapacity"
                                                name="seatingCapacity"
                                                placeholder='Enter Seating Capacity'
                                                value={formik.values.seatingCapacity}
                                                onChange={formik.handleChange}
                                                onKeyDown={utils.handleNumericKey}
                                                error={Boolean(formik.touched.seatingCapacity && formik.errors.seatingCapacity)}
                                            />
                                            <FormHelperText error={Boolean(formik.touched.seatingCapacity && formik.errors.seatingCapacity)} sx={{ marginLeft: 0 }}>
                                                {formik.touched.seatingCapacity && formik.errors.seatingCapacity}
                                            </FormHelperText>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{ p: 1.5 }}>
                        <Grid container justifyContent='space-between' alignItems='center'>
                            <Grid item lg={12} xl={12}>
                                <Stack direction='row' spacing={2}>
                                    <LoadingButton
                                        loading={formik.isSubmitting}
                                        type='submit'
                                        variant='contained'
                                        disabled={formik.isSubmitting}
                                    >
                                        Save
                                    </LoadingButton>
                                    <Button variant='outlined' color='error' onClick={onClose} >
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

export default SaveDiningTableDialog;
