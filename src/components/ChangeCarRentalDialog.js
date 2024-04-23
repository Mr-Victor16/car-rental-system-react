import EditIcon from "@mui/icons-material/Edit";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from '../lib/axiosConfig';
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
    rentalStartDate: Yup.date()
        .required("Rental start date is required")
        .max(Yup.ref('rentalEndDate'), 'Start date must be before or equal to end date'),
    rentalEndDate: Yup.date()
        .required('Rental end date is required')
        .min(Yup.ref('rentalStartDate'), 'End date must be after or equal to start date')
});

export default function ChangeCarRentalDialog(props){
    const dispatch = useDispatch();
    const token = AuthHeader();
    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalCost, setRentalCost] = useState(0);
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            rentalStartDate: props.startDate,
            rentalEndDate: props.endDate,
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    useEffect(() => {
        handleChangeRentalDate();
    }, [formik.values.rentalStartDate, formik.values.rentalEndDate]);

    const handleClickOpenRentalDialog = () => {
        setOpenRentalDialog(true);
    };

    const handleCloseRentalDialog = () => {
        setOpenRentalDialog(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChangeRentalDate = () => {
        let difference = new Date(formik.values.rentalEndDate).getTime() - new Date(formik.values.rentalStartDate).getTime();
        setRentalCost(props.carPrice * (Math.ceil(difference / (1000 * 3600 * 24))+1));
    };

    const updateCarRental = async () => {
        axios.put('rental/'+props.rentalID, {
            startDate: formik.values.rentalStartDate,
            endDate: formik.values.rentalEndDate
        },{
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Rental date changed successfully", true));
                handleCloseRentalDialog();
                await delay(2000);
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified rental was not found", false));
                } else if (error.response.status === 400) {
                    dispatch(showSnackbar("Invalid car rental date range entered", false));
                } else {
                    dispatch(showSnackbar("Error occurred while updating the rental date. Please contact the administrator", false));
                }
            })
    };

    return (
        <>
            <Button
                variant="contained"
                color="warning"
                onClick={() => {
                    handleClickOpenRentalDialog();
                }}
            >
                <EditIcon fontSize="small" />
            </Button>

            <Dialog open={openRentalDialog} onClose={handleCloseRentalDialog}>
                <DialogTitle>Change rental date</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Select the rental period, then confirm using the button
                    </DialogContentText>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental start date</InputLabel>
                        <TextField
                            id={"rentalStartDate"}
                            type={"date"}
                            name={"rentalStartDate"}
                            value={formik.values.rentalStartDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rentalStartDate && Boolean(formik.errors.rentalStartDate)}
                            helperText={formik.touched.rentalStartDate && formik.errors.rentalStartDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental end date</InputLabel>
                        <TextField
                            id={"rentalEndDate"}
                            type={"date"}
                            name={"rentalEndDate"}
                            value={formik.values.rentalEndDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rentalEndDate && Boolean(formik.errors.rentalEndDate)}
                            helperText={formik.touched.rentalEndDate && formik.errors.rentalEndDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel> Rental cost </InputLabel>
                        <TextField
                            value={Boolean(formik.isValid) ? (rentalCost + ' zł') : ( ' - zł ')}
                            readOnly
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={updateCarRental} disabled={!(formik.isValid)}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}