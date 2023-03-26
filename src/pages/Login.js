import React, { useState } from 'react';
import { Typography, TextField, Box, Button, Stack, Container, Alert, Fade } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    let navigate = useNavigate();

    const logIn = async () => {
        axios.post("http://localhost:8080/api/auth/signin", { username,password })
        .then(response => {
            console.log(response);

            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            navigate('/', { replace: true });
        })
        .catch((error) => {
            setError(error);
            setOpen(true);
        })
    }

    const handleClose = async () => {
        setOpen(false);
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

                    <Fade in={open} autoHideDuration={60000} onClose={handleClose}>
                        <Alert severity="error" anim>{error.message}</Alert>
                    </Fade>

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