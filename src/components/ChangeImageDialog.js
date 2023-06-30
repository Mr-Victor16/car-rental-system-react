import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import React, {useState} from "react";
import AuthHeader from "../services/authHeader";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
const API_URL = "http://localhost:8080/api";

export default function ChangeImageDialog(props) {
    const [open, setOpen] = useState(false);
    const token = AuthHeader();
    const [setCars] = props.cars;
    const [carID] = useState(props.carID);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const getCarsList = async () => {
        axios.get(API_URL + '/cars/available')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);

        axios.put(API_URL + '/car/'+carID+'/image', formData, {
            headers: token
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie zmieniono zdjęcie");
                setOpen(false);
                await delay(1500);
                setCars(getCarsList());
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas zmiany zdjęcia!");
            })
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <ImageIcon fontSize="small" />
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Zmień zdjęcie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wybierz nowe zdjęcie auta, a następnie zatwierdź zmiany przyciskiem.
                    </DialogContentText>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onFileUpload}>Zatwierdź zmianę</Button>
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