import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from '../../lib/axiosConfig';
import {showSnackbar} from "../../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";
import {getActualDate} from "../../helpers/actualDate";

const addDate = getActualDate();

const newRentalValidationSchema = Yup.object({
    startDate: Yup.date()
        .required("Rental start date is required")
        .min(new Date(addDate), "Rental start date cannot be in the past"),
    endDate: Yup.date()
        .required('Rental end date is required')
        .min(Yup.ref('startDate'), 'End date must be after or equal to start date')
});

const editRentalValidationSchema = Yup.object({
    startDate: Yup.date()
        .required("Rental start date is required")
        .max(Yup.ref('endDate'), 'Start date must be before or equal to end date'),
    endDate: Yup.date()
        .required('Rental end date is required')
        .min(Yup.ref('startDate'), 'End date must be after or equal to start date')
});

export default function CarRentalDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();
    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    let navigate = useNavigate();
    const rentalID = props.rentalID;
    const [rentalCost, setRentalCost] = useState(0);
    const buttonLabel = rentalID ? "Update" : "Send request";
    const dialogTitle = rentalID ? "Change rental date" : "Rent a car";
    const carID = props.carID;

    const getInitialValues = () => {
        return rentalID ? {
            startDate: props.startDate,
            endDate: props.endDate,
        } : {
            startDate: addDate,
            endDate: addDate,
        };
    };

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: rentalID ? editRentalValidationSchema : newRentalValidationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const handleChangeRentalDate = () => {
        let difference = new Date(formik.values.endDate).getTime() - new Date(formik.values.startDate).getTime();
        setRentalCost(props.price * (Math.ceil(difference / (1000 * 3600 * 24))+1));
    };

    useEffect(() => {
        handleChangeRentalDate();
    }, [formik.values.startDate, formik.values.endDate]);

    const handleClickOpenRentalDialog = () => {
        setOpenRentalDialog(true);
    };

    const handleCloseRentalDialog = () => {
        setOpenRentalDialog(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const addCarRental = async () => {
        axios.post('rental', {
            carID, userID: userDetails.id, ...formik.values, addDate
        },{
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car rental request submitted successfully", true));
                handleCloseRentalDialog();
                await delay(2000);
                navigate('/my-rentals');
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified car was not found", false));
                } else if (error.response.status === 400) {
                    dispatch(showSnackbar("Invalid car rental date range entered", false));
                } else {
                    dispatch(showSnackbar("Error occurred while attempting to rent the car. Please contact the administrator", false));
                }
            })
    };

    const updateCarRental = async () => {
        axios.put('rental/'+rentalID, {
            ...formik.values
        },{
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Rental date changed successfully", true));
                handleCloseRentalDialog();
                props.updateRentalInList(rentalID, formik.values);
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

    const buttonOnClick = rentalID ? updateCarRental : addCarRental;

    return (
        <>
            <Button
                variant="contained"
                size="small"
                onClick={() => {
                    handleClickOpenRentalDialog();
                }}
            >
                {props.icon}
            </Button>

            <Dialog open={openRentalDialog} onClose={handleCloseRentalDialog}>
                <DialogTitle> {dialogTitle} </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Select the rental period, then confirm using the button
                    </DialogContentText>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental start date</InputLabel>
                        <TextField
                            id={"startDate"}
                            type={"date"}
                            name={"startDate"}
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental end date</InputLabel>
                        <TextField
                            id={"endDate"}
                            type={"date"}
                            name={"endDate"}
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
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
                    <Button onClick={buttonOnClick} disabled={!(formik.isValid)}> {buttonLabel} </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}