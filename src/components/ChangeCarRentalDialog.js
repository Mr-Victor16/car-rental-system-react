import EditIcon from "@mui/icons-material/Edit";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {showSnackbar} from "../actions/snackbarActions";

export default function ChangeCarRentalDialog(props){
    const dispatch = useDispatch();
    const token = AuthHeader();
    const API_URL = "http://localhost:8080/api";

    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState(props.startDate);
    const [rentalEndDate, setRentalEndDate] = useState(props.endDate);
    const [carPrice] = useState(props.carPrice);
    const [rentalCost, setRentalCost] = useState(0);
    const [rentalID] = useState(props.rentalID);
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

    const updateCarRental = async () => {
        axios.put(API_URL + '/rental/'+rentalID, {
            startDate: rentalStartDate,
            endDate: rentalEndDate
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
                    <Button onClick={updateCarRental}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}