import React, { useEffect } from 'react';
import { Typography, TextField, Box, Button, Stack, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/userDetailsReducer';
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username field cannot be empty"),
    password: Yup.string()
        .required("Password field cannot be empty"),
});

const Login = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const logIn = async () => {
        axios.post("auth/signin", formik.values)
            .then(response => {
                if (response.data.token) {
                    dispatch(login(response.data));
                }

                navigate('/', { replace: true });
            })
            .catch(function(error) {
                if(error.response.status === 401) {
                    dispatch(showSnackbar("Incorrect login credentials", false));
                } else {
                    dispatch(showSnackbar("Error occurred during login attempt, please contact the administrator", false));
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
                marginTop={10}
            >
                <Stack spacing={2}>
                    <Typography variant='h3' align='center'>Login</Typography>

                    <TextField
                        id={"username"}
                        name={"username"}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        label="Username"
                    />

                    <TextField
                        id={"password"}
                        name={"password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        label="Password"
                        type={"password"}
                    />

                    <Button variant="contained" onClick={logIn} disabled={!(formik.isValid && formik.dirty)}>Log in</Button>
                    <Button variant="outlined" component={Link} to="../register">Create an account</Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default Login;