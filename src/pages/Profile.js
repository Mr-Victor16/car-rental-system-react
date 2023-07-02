import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountPics from "../images/blank-profile-picture.png";
import {TextField, Typography, Box, Stack, Container, FormGroup, InputLabel, DialogContentText, DialogContent,
    DialogTitle, Dialog, DialogActions, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";

const Profile = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const API_URL = "http://localhost:8080/api";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const editPassword = () => {
        if(newPassword !== ""){
            setOpen(false);

            axios.put(API_URL + '/profile/' + userDetails.id + '/password', {
                newPassword: newPassword,
            },{
                headers: token
            })
                .then(async () => {
                    dispatch(showSnackbar("Pomyślnie zmieniono hasło", true));
                    await delay(2000);
                    navigate('/', {replace: true});
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(showSnackbar("Błąd podczas zmiany hasła", false));
                })
        } else {
            dispatch(showSnackbar("Nie wprowadzono nowego hasła", false));
        }
    };

    useEffect(() => {
        if (userDetails.token === "") {
            navigate('/', {replace: true});
        }
    });

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Stack spacing={2}>
                    <img
                        src={AccountPics}
                        style={{ width: 200, height: 200, borderRadius: 200 / 2, alignSelf: 'center' }}
                        alt="Profile avatar"
                        loading="lazy"
                    />
            
                    <Typography variant='h3' align='center'>{userDetails.username}</Typography>

                    <FormGroup>
                        <InputLabel>
                            Adres e-mail
                        </InputLabel>
                        <TextField
                            value={userDetails.email}
                            readOnly
                        />
                    </FormGroup>
                    
                    <Button variant="contained" onClick={handleClickOpen}>Zmień hasło</Button>
                </Stack>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Zmień hasło</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Podaj nowe hasło, a następnie zatwierdź zmiany przyciskiem.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Nowe hasło"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editPassword}>Zatwierdź zmianę</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
  
export default Profile;