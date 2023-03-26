import React, { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button, Stack, Container, Alert, Fade } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector } from "react-redux";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    let navigate = useNavigate();
    const userDetails = useSelector((state) => state.userDetails);

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const signUp = async () => {
        if(password === confirmPassword){
            axios.post("http://localhost:8080/api/auth/signup", { username: username, email: email, password: password})
            .then(() => {
                navigate('/login', { replace: true });
            })
            .catch((error) => {
                console.log(password.valueOf, email.valueOf, username.valueOf, "a");
                setError(error.message);
                setOpen(true);
            })
        }
        else if (password !== confirmPassword) {
            setError("Hasła nie są takie same!");
            setOpen(true);
        }
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
                    <Typography variant='h3' align='center'>Rejestracja</Typography>

                    <Fade in={open} autohideduration={60000} onClose={handleClose}>
                        <Alert severity="error">{error}</Alert>
                    </Fade>

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