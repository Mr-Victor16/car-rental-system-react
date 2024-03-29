import CarRentalIcon from "@mui/icons-material/CarRental";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {showSnackbar} from "../actions/snackbarActions";

export default function CarRentalDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();
    const API_URL = "http://localhost:8080/api";

    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [rentalEndDate, setRentalEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [carPrice] = useState(props.price);
    const [rentalCost, setRentalCost] = useState(0);
    const [carID] = useState(props.carID);
    let navigate = useNavigate();

    useEffect(() => {
        handleChangeRentalDate();
    }, [rentalStartDate, rentalEndDate]);

    const handleClickOpenRentalDialog = () => {
        setOpenRentalDialog(true);
    };

    const handleCloseRentalDialog = () => {
        setOpenRentalDialog(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChangeRentalDate = () => {
        if(rentalStartDate !== "" && rentalEndDate !== ""){
            let startDate = new Date(rentalStartDate);
            let endDate = new Date(rentalEndDate);

            if (endDate < startDate) {
                setRentalStartDate(rentalEndDate);
            } else {
                let difference = endDate.getTime() - startDate.getTime();
                setRentalCost(carPrice * (Math.ceil(difference / (1000 * 3600 * 24))+1));
            }
        }
    };

    const addCarRental = async () => {
        axios.post(API_URL + '/rental', {
            carID: carID,
            userID: userDetails.id,
            startDate: rentalStartDate,
            addDate: new Date().toISOString().slice(0, 10),
            endDate: rentalEndDate
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

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => {
                    handleClickOpenRentalDialog();
                }}
            >
                <CarRentalIcon fontSize="small" />
            </Button>

            <Dialog open={openRentalDialog} onClose={handleCloseRentalDialog}>
                <DialogTitle>Rent a car</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Select the rental period, then confirm using the button
                    </DialogContentText>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel> Rental start date </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalStartDate(e.target.value);
                            }}
                            value={rentalStartDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel> Rental start date </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalEndDate(e.target.value);
                            }}
                            value={rentalEndDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel> Rental cost </InputLabel>
                        <TextField
                            value={ rentalCost + ' PLN'}
                            readOnly
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addCarRental}>Send request</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}