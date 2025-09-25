import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { Typography, Grid, Stack, Button, TextField, useMediaQuery, InputLabel, FormHelperText, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { useState } from 'react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import * as Yup from 'yup';
import apiService from 'service/ApiService';
import dateHelper from 'utils/dateHelper';

const SearchOrder = () => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState(null);

    const orderSchema = Yup.object().shape({
        date: Yup.date()
            .nullable()
            .required('Date is required')
            .typeError('Invalid date format'),
        openingTime: Yup.date()
            .nullable()
            .required('Opening time is required')
            .typeError('Invalid time format'),
        closingTime: Yup.date()
            .nullable()
            .required('Closing time is required')
            .typeError('Invalid time format'),
    })

    const formik = useFormik({
        initialValues: {
            openingTime: '',
            closingTime: '',
            date: '',
        },
        validationSchema: orderSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            const { data } = await apiService.getOrdersAsync(dateHelper.formatDate(values.date), dateHelper.convertTimeZone(values.openingTime), dateHelper.convertTimeZone(values.closingTime))
            setOrders(data);
            setSubmitting(false);
        },
    });

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleTimeChange = (fieldName) => (value) => {
        formik.setFieldValue(fieldName, value);
    };

    return (
        <>
            <Grid container rowSpacing={3} columnSpacing={3}>
                <Grid item xs={12}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack><Typography variant='h2'>Manage Orders</Typography></Stack>
                        <Stack direction={'row'} justifyContent={'end'}>
                            <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <MainCard content={false}>
                        <ScrollX>
                            <Stack spacing={3}>
                                <FormikProvider value={formik}>
                                    <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                                        <Stack spacing={3}>
                                            <Stack
                                                direction={matchDownMD ? 'column' : 'row'}
                                                alignItems="center"
                                                spacing={2}
                                                sx={{ py: 3, px: 3 }}
                                            >
                                                <Grid item md={3}>
                                                    <DatePicker
                                                        id="date"
                                                        name="date"
                                                        value={formik.values.date}
                                                        onChange={(value) => formik.setFieldValue('date', value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                fullWidth
                                                                {...params}
                                                                error={Boolean(formik.touched.date && formik.errors.date)}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText
                                                        error={Boolean(formik.touched.date && formik.errors.date)}
                                                        sx={{ marginLeft: 0 }}
                                                    >
                                                        {formik.touched.date && formik.errors.date}
                                                    </FormHelperText>
                                                </Grid>

                                                <Grid item md={3}>
                                                    <TimePicker
                                                        id="openingTime"
                                                        name="openingTime"
                                                        value={formik.values.openingTime}
                                                        onChange={handleTimeChange('openingTime')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                error={Boolean(formik.touched.openingTime && formik.errors.openingTime)}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText
                                                        error={Boolean(formik.touched.openingTime && formik.errors.openingTime)}
                                                    >
                                                        {formik.touched.openingTime && formik.errors.openingTime}
                                                    </FormHelperText>
                                                </Grid>

                                                <Grid item md={3}>
                                                    <TimePicker
                                                        id="closingTime"
                                                        name="closingTime"
                                                        value={formik.values.closingTime}
                                                        onChange={handleTimeChange('closingTime')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                error={Boolean(formik.touched.closingTime && formik.errors.closingTime)}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText
                                                        error={Boolean(formik.touched.closingTime && formik.errors.closingTime)}
                                                    >
                                                        {formik.touched.closingTime && formik.errors.closingTime}
                                                    </FormHelperText>
                                                </Grid>

                                                <Grid item md={3}>
                                                    <TextField
                                                        label="Search Orders"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="medium"
                                                        autoComplete="off"
                                                        value={search}
                                                        onChange={handleSearchChange}
                                                    />
                                                </Grid>

                                                {/* Submit Button */}
                                                <Grid item md={2}>
                                                    <Button type="submit" variant="contained" fullWidth>
                                                        Search
                                                    </Button>
                                                </Grid>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                </FormikProvider>

                            </Stack>
                        </ScrollX>
                    </MainCard>

                    <Grid item md={12} pt={3}>
                        <MainCard content={false} onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(original);
                            setOpenConfirmDialog(true);
                        }}>
                            {orders && orders.length > 0 ? <Typography pl={2} pt={2} variant='h5'>Orders</Typography> : null}
                            <Grid container spacing={2} p={2}>
                                {
                                    orders && orders.map((item, index) => {
                                        return (
                                            <Grid item md={4} key={index}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        backgroundColor: '#fafafa',
                                                        padding: 2,
                                                        borderRadius: 2,
                                                        transition: 'background-color 0.3s ease',
                                                    }}
                                                >
                                                    <Stack>
                                                        <Typography variant='body1'>{item.name}</Typography>
                                                        <Typography variant='body2'>${item.price}</Typography>
                                                    </Stack>
                                                    <Stack>
                                                        <Chip
                                                            label={<Typography sx={{ fontSize: 10, lineHeight: 1 }}>{item.quantity}</Typography>}
                                                            sx={{
                                                                backgroundColor: '#b4d8f0',
                                                                borderRadius: '20px',
                                                                height: 'auto',
                                                                px: 1.5,
                                                                py: 0.5
                                                            }}
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                        );
                                    })
                                }
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid >
        </>
    );
};

export default SearchOrder;
