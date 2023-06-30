import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    FormControl,
    MenuItem,
    Select,
    Snackbar,
    Alert
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AuthHeader from "../services/authHeader";
const API_URL = "http://localhost:8080/api";

export default function ChangeRentalStatusDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentStatus] = useState(props.status);
    const [setRentals] = props.setRentals;
    const [status, setStatus] = React.useState(0);
    const [rentalID] = useState(props.rentalID);
    const [statusList] = useState(props.statusList);
    let navigate = useNavigate();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        }
    },[userDetails.token]);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChange = (event) => {
        setStatus(event.target.value);

        axios.put(API_URL + '/rental/'+rentalID+'/status/'+event.target.value, {},{
            headers: token,
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie zmieniono status wynajmu");
                await delay(1000);
                getRentals();
                handleClose();
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas zmiany statusu wynajmu!");
            })

    };

    const getRentals = () => {
        axios.get(API_URL + '/rentals',{
            headers: token
        })
            .then((response) => {
                setRentals(response.data)
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas pobierania listy wynajmów");
            })
    };

    function getStatusName(name){
        switch(name){
            case "STATUS_PENDING": {
                return "Przetwarzanie";
            }
            case "STATUS_ACCEPTED": {
                return "Zaakceptowany";
            }
            case "STATUS_REJECTED": {
                return "Odrzucony";
            }
            case "STATUS_CANCELLED": {
                return "Anulowany";
            }
            default: {
                return "Nierozpoznany";
            }
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <BookmarkIcon fontSize="small" />
            </Button>

            <Dialog open={openDialog} onClose={handleClose} maxWidth={"xs"} fullWidth>
                <DialogTitle>Zmień status wynajmu</DialogTitle>

                <DialogContent align="center">
                    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={handleChange}
                            required
                        >
                            { statusList && statusList.length > 0 && (
                                statusList
                                    .filter(status => status.id !== currentStatus.id)
                                    .map((filteredStatus, index) => {
                                        return (
                                            <MenuItem key={index} value={filteredStatus.id}>{getStatusName(filteredStatus.name)}</MenuItem>
                                        );
                                    })
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zamknij</Button>
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
        </>
    );
}