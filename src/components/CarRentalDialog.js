import CarRentalIcon from "@mui/icons-material/CarRental";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {showSnackbar} from "../actions/snackbarActions";
const API_URL = "http://localhost:8080/api";

export default function CarRentalDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
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
            startDate: rentalStartDate,
            endDate: rentalEndDate,
            addDate: new Date().toISOString().slice(0, 10),
            carID: carID,
            userID: userDetails.id
        },{
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Pomyślnie wysłano zapytanie o wynajem auta", true));
                handleCloseRentalDialog();
                await delay(2000);
                navigate('/my-rentals');
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Błąd podczas wysyłania zapytania o wynajem auta", false));
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
                <DialogTitle>Wynajmij auto</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wybierz okres wynajmu, a następnie zatwierdź zmiany przyciskiem.
                    </DialogContentText>
                    <FormGroup>
                        <InputLabel> Początek wynajmu </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalStartDate(e.target.value);
                            }}
                            value={rentalStartDate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel> Koniec wynajmu </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalEndDate(e.target.value);
                            }}
                            value={rentalEndDate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel> Koszt wynajmu </InputLabel>
                        <TextField
                            value={ rentalCost + ' zł'}
                            readOnly
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addCarRental}>Wynajmij</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}