import React, { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button, Stack, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {showSnackbar} from "../actions/snackbarActions";

const API_URL = "http://localhost:8080/api/auth/";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const signUp = async () => {
        if(password === confirmPassword){
            axios.post(API_URL + "signup", { username: username, email: email, password: password})
            .then(() => {
                navigate('/login', { replace: true });
            })
                .catch(function(error) {
                    if(error.response.status === 401) {
                        dispatch(showSnackbar("Sprawdź czy wszystkie pola zostały uzupełnione poprawnie", false));
                    } else if(error.response.status === 409) {
                        dispatch(showSnackbar("Nazwa użytkownika lub/i hasło jest już zajęte", false));
                    } else {
                        dispatch(showSnackbar("Wystąpił błąd podczas próby rejestracji, skontaktuj się z administratorem", false));
                    }
                })
        }
        else if (password !== confirmPassword) {
            dispatch(showSnackbar("Hasła nie są takie same", false));
        }
    }

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
                    <Typography variant='h3' align='center'>Rejestracja</Typography>

                    <TextField
                        required
                        label="Nazwa użytkownika"
                        onChange={(e) => setUsername(e.target.value)}
                        />  

                    <TextField
                        required
                        label="Adres e-mail"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />

                    <TextField
                        required
                        label="Hasło"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        required
                        label="Powtórz hasło"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                
                    <Button variant="contained" onClick={signUp}>Zarejestruj się</Button>
                    <Button variant="outlined" component={Link} to="../login">Masz już konto? Zaloguj się</Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default Register;