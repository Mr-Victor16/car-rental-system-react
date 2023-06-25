import CarRentalIcon from "@mui/icons-material/CarRental";
import {
    Alert,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormGroup,
    InputLabel, Snackbar,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const API_URL = "http://localhost:8080/api";

export default function CarRentalDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [carPrice] = useState(props.price);
    const [rentalCost, setRentalCost] = useState(0);
    const [carID] = useState(props.carID);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");
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

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

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
        axios.post(API_URL + '/rental/add', {
            startDate: rentalStartDate,
            endDate: rentalEndDate,
            addDate: new Date().toISOString().slice(0, 10),
            carID: carID,
            userID: userDetails.id
        },{
            headers: token
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie wysłano zapytanie o wynajem auta");
                setOpenRentalDialog(false);
                await delay(1000);
                navigate('/my-rentals');
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas wynajmu auta!");
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

            <Snackbar open={error} autohideduration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {info}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autohideduration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {info}
                </Alert>
            </Snackbar>
        </div>
    );
}