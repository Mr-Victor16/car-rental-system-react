import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountPics from "../images/blank-profile-picture.png";
import {
    TextField,
    Typography,
    Box,
    Stack,
    Container,
    FormGroup,
    InputLabel,
    DialogContentText,
    DialogContent,
    DialogTitle,
    Dialog,
    DialogActions,
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";

const Profile = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const API_URL = "http://localhost:8080/api";
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

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const editPassword = () => {
        if(newPassword !== ""){
            setOpen(false);

            axios.post(API_URL + '/profile/change-password', {
                userID: userDetails.id,
                newPassword: newPassword,
            },{
                headers: token
            })
                .then(async () => {
                    setSuccess(true);
                    setInfo("Pomyślnie zmieniono hasło");
                    await delay(4000);
                    navigate('/', {replace: true});
                    setError(false);
                })
                .catch((error) => {
                    console.log(error);
                    setError(true);
                    setInfo("Błąd podczas zmiany hasła!");
                })
        } else {
            setError(true);
            setInfo("Nie wprowadzono nowego hasła!");
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
        </Container>
    );
};
  
export default Profile;