import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
    Button
} from '@mui/material';
import { Formik, Form } from 'formik';
import enums from 'utils/enums';

const CommentDialog = ({ selectedOrder, open, onSave, onCancel }) => {
    const initialValues = {
        comment: '',
        status: enums.carStatus.GREEN
    };

    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            open={open}
            onClose={onCancel}
            sx={{ '& .MuiDialog-paper': { pt: 2 } }}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                    const payload = {
                        orderId: selectedOrder.orderId,
                        carId: selectedOrder.carId,
                        comment: values.comment,
                        status: values.status
                    };
                    onSave(payload);
                    setSubmitting(false);
                }}
            >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <DialogTitle>Update Status</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <RadioGroup
                                row
                                id="status"
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            >
                                <FormControlLabel value={enums.carStatus.GREEN} control={<Radio />} label="Green" />
                                <FormControlLabel value={enums.carStatus.RED} control={<Radio />} label="Red" />
                            </RadioGroup>
                            <TextField
                                fullWidth
                                id="comment"
                                name="comment"
                                label="Comment"
                                placeholder="Enter your comment"
                                value={values.comment}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                variant="outlined"
                            />

                        </DialogContent>

                        <Divider />
                        <DialogActions sx={{ p: 2 }}>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Save
                            </Button>
                            <Button color="error" onClick={onCancel} variant="outlined">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CommentDialog;
