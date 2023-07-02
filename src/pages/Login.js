import React, { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button, Stack, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/userDetailsReducer';
import {showSnackbar} from "../actions/snackbarActions";

const API_URL = "http://localhost:8080/api/auth/";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const logIn = async () => {
        axios.post(API_URL + "signin", { username,password })
        .then(response => {
            if (response.data.token) {
                dispatch(login(response.data));
            }

            navigate('/', { replace: true });
        })
        .catch(function(error) {
            if(error.response.status === 401) {
                dispatch(showSnackbar("Wprowadzono błędne dane logowania", false));
            } else if(error.response.status === 404){
                dispatch(showSnackbar("Użytkownik o podanej nazwie użytkownika, nie istnieje", false));
            } else {
                dispatch(showSnackbar("Wystąpił błąd podczas próby logowania, skontaktuj się z administratorem", false));
            }
        })
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
                    <Typography variant='h3' align='center'>Logowanie</Typography>

                    <TextField
                        required
                        label="Nazwa użytkownika"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        required
                        label="Hasło"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                
                    <Button variant="contained" onClick={logIn}>Zaloguj się</Button>
                    <Button variant="outlined" component={Link} to="../register">Załóż konto</Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default Login;