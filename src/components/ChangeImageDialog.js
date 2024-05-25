import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, {useState} from "react";
import AuthHeader from "../services/authHeader";
import axios from '../lib/axiosConfig';
import ImageIcon from "@mui/icons-material/Image";
import {showSnackbar} from "../actions/snackbarActions";
import {useDispatch} from "react-redux";

export default function ChangeImageDialog(props) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const token = AuthHeader();
    const [setCars] = props.cars;
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const getCarsList = async () => {
        axios.get('cars/available')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while fetching the list of available cars. Please contact the administrator", false));
            })
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);

        axios.put('car/'+props.carID+'/image', formData, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car photo successfully changed", true));
                await delay(2000);
                handleClose();
                setCars(getCarsList());
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while changing the car photo", false));
            })
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <ImageIcon fontSize="small" />
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change car photo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select a new car photo, then confirm the changes with the button
                    </DialogContentText>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onFileUpload}>Confirm changes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}