import React, { useState, useEffect } from "react";
import axios from '../lib/axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import {TextField, Typography, Box, Select, Container, FormGroup, InputLabel, Button, Grid, MenuItem, FormHelperText, FormControl} from '@mui/material';
import {useDispatch} from "react-redux";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";
import {getFuelTypeName} from "../helpers/fuelTypes";
import {getActualDate} from "../helpers/actualDate";

const CarForm = () => {
    const dispatch = useDispatch();
    const [fuelList, setFuelList] = useState([]);
    let navigate = useNavigate();
    const maxYear = new Date(getActualDate()).getFullYear();
    const token = AuthHeader();
    let { id } = useParams();
    const buttonLabel = id ? 'Save changes' : 'Add car';

    useEffect(() => {
        getFuelList();
        if (id != null) getCarInfo();
    }, [id]);

    const validationSchema = Yup.object({
        horsePower: Yup.number()
            .min(50, "The value of the car's horsepower is too small (min. is 50)")
            .required("Horse power field cannot be empty"),
        price: Yup.number()
            .min(50, "The daily rental amount for the car is too small (min. is 50 zł)")
            .required("Price field cannot be empty"),
        year: Yup.number()
            .min(1970, "The value for the car's production year is too small (min. is 1970)")
            .max(maxYear, "The car's production year is higher than the current year")
            .required("Production year field cannot be empty"),
        mileage: Yup.number()
            .min(1, "The mileage value for the car must be at least 1 km")
            .required("Mileage field cannot be empty"),
        brand: Yup.string()
            .min(3, "Brand name is too short")
            .max(30, "Brand name is too long")
            .required("Brand field cannot be empty"),
        model: Yup.string()
            .min(2, "Model name is too short")
            .max(30, "Model name is too long")
            .required("Model field cannot be empty"),
        capacity: Yup.string()
            .required("Capacity field cannot be empty"),
        fuelType: Yup.number()
            .required("You must select a fuel type")
            .min(1)
            .max(fuelList.length)
    });

    const formik = useFormik({
        initialValues: {
            horsePower: 50,
            price: 50,
            year: maxYear,
            mileage: 1,
            brand: "",
            model: "",
            capacity: "",
            fuelType: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const addCar = async () => {
        axios.post('car', {
            ...formik.values
        },{
            headers: token,
        })
            .then(async () => {
                dispatch(showSnackbar("Car successfully added", true));
                await delay(2000);
                navigate('/', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while adding the car", false));
            })
    }

    const getCarInfo = () => {
        axios.get('car/'+id, {
            headers: token
        })
            .then(async (response) => {
                if(response.data.length === 0){
                    dispatch(showSnackbar("The specified car was not found", false));
                    await delay(2000);
                    navigate("../car/add");
                } else {
                    await formik.setValues({
                        horsePower: response.data.horsePower,
                        price: response.data.price,
                        mileage: response.data.mileage,
                        brand: response.data.brand.name,
                        model: response.data.model.name,
                        capacity: response.data.capacity,
                        fuelType: response.data.fuelType.id,
                        year: response.data.year
                    });
                }
            })
            .catch(async (error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while retrieving car information", false));
                await delay(2000);
                navigate('/', {replace: true});
            })
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const editCar = async () => {
        axios.put('car/' + id, {
            ...formik.values
        }, {
            headers: token,
        })
            .then(async () => {
                dispatch(showSnackbar("Car information has been successfully updated", true));
                await delay(2000);
                navigate('/', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified car was not found", false));
                } else {
                    dispatch(showSnackbar("Error occurred while updating car information", false));
                }
            })
    }

    const buttonOnClick = id ? editCar : addCar;

    const getFuelList = () => {
        axios.get('fuels')
            .then(async (response) => {
                if (response.data.length === 0) {
                    dispatch(showSnackbar("Error occurred while retrieving the list of fuel types", false));
                    await delay(2000);
                    navigate('/', {replace: true});
                } else {
                    setFuelList(response.data);
                }
            })
            .catch(async (error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while retrieving the list of fuel types", false));
                await delay(2000);
                navigate('/', {replace: true});
            })
    };

    return (
        <Container maxWidth="md">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1 },
                    mt: { xs: 5, md: 10 },
                    mb: { xs: 5, md: 10 }
                }}
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} alignItems={"center"}>
                        <Typography variant='h4' align='center'>
                            { id ? 'Edit car information' : 'Add a new car' }
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"brand"}
                                name={"brand"}
                                value={formik.values.brand}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.brand && Boolean(formik.errors.brand)}
                                helperText={formik.touched.brand && formik.errors.brand}
                                label="Brand"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"model"}
                                name={"model"}
                                value={formik.values.model}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.model && Boolean(formik.errors.model)}
                                helperText={formik.touched.model && formik.errors.model}
                                label="Model"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"capacity"}
                                name={"capacity"}
                                value={formik.values.capacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                                helperText={formik.touched.capacity && formik.errors.capacity}
                                label="Capacity"
                                placeholder="e.g. '2.0 TFSI'"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"horsePower"}
                                name={"horsePower"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 50 } }}
                                value={formik.values.horsePower}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.horsePower && Boolean(formik.errors.horsePower)}
                                helperText={formik.touched.horsePower && formik.errors.horsePower}
                                label="Horse power"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"year"}
                                name={"year"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 1970, max: maxYear } }}
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helperText={formik.touched.year && formik.errors.year}
                                label="Production year"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"mileage"}
                                name={"mileage"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 1 } }}
                                value={formik.values.mileage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mileage && Boolean(formik.errors.mileage)}
                                helperText={formik.touched.mileage && formik.errors.mileage}
                                label="Mileage"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <TextField
                                id={"price"}
                                name={"price"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 50 } }}
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                label="Price per day"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Fuel type</InputLabel>
                            <Select
                                label="Fuel type"
                                id={"fuelType"}
                                name={"fuelType"}
                                value={formik.values.fuelType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}
                            >
                                { fuelList && fuelList.length > 0 && (
                                    fuelList.map((fuel, index) => {
                                        return (
                                            <MenuItem key={index} value={fuel.id}>{getFuelTypeName(fuel.name)}</MenuItem>
                                        );
                                    })
                                )}
                            </Select>
                            {formik.touched.fuelType && Boolean(formik.errors.fuelType) && (
                                <FormHelperText>{formik.touched.fuelType && formik.errors.fuelType}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={buttonOnClick} disabled={!(formik.isValid && formik.dirty)} fullWidth>{buttonLabel}</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default CarForm;