import {Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, FormControl, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import axios from '../../lib/axiosConfig';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AuthHeader from "../../services/authHeader";
import {showSnackbar} from "../../actions/snackbarActions";
import {getStatusName} from "../../helpers/rentalStatusNames";

export default function ChangeRentalStatusDialog(props){
    const dispatch = useDispatch();
    const token = AuthHeader();
    const [openDialog, setOpenDialog] = useState(false);
    const [setRentals] = props.setRentals;
    const [status, setStatus] = useState("");
    const [statusList] = useState(props.statusList);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChange = (event) => {
        setStatus(event.target.value);

        axios.put('rental/'+props.rentalID+'/status/'+event.target.value, {},{
            headers: token,
        })
            .then(async () => {
                dispatch(showSnackbar("Rental status changed successfully", true));
                await delay(2000);
                getRentals();
                handleClose();
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified rental was not found", false));
                } else if (error.response.status === 400) {
                    dispatch(showSnackbar("The specified rental status was not found", false));
                } else{
                    dispatch(showSnackbar("Error occurred while changing the rental status", false));
                }
            })

    };

    const getRentals = () => {
        axios.get('rentals',{
            headers: token
        })
            .then((response) => {
                setRentals(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while retrieving the list of rentals", false));
            })
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <BookmarkIcon fontSize="small" />
            </Button>

            <Dialog open={openDialog} onClose={handleClose} maxWidth={"xs"} fullWidth>
                <DialogTitle>Update rental status</DialogTitle>

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
                                    .filter(status => status.id !== props.status.id)
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
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}