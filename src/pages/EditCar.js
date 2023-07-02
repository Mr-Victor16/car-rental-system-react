import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, useParams} from 'react-router-dom';
import {TextField, Typography, Box, Select, Container, FormGroup, InputLabel, Button, Grid, MenuItem} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";
const API_URL = "http://localhost:8080/api";

const EditCar = () => {
    const [fuelList, setFuelList] = useState([]);
    let navigate = useNavigate();
    let { id } = useParams();

    const currentTime = new Date();
    const maxYear = currentTime.getFullYear();
    const [productionYear, setProductionYear] = useState(currentTime.getFullYear());

    const [horsePower, setHorsePower] = useState(1);
    const [price, setPrice] = useState(1);
    const [mileage, setMileage] = useState(0);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [capacity, setCapacity] = useState("");
    const [fuelType, setFuelType] = useState(1);

    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    useEffect(() => {
        getFuelList();
        getCarInfo();
    }, [userDetails.token]);

    const getCarInfo = () => {
        if((userDetails.token !== "") && (userDetails.roles.includes("ROLE_ADMIN"))){
            axios.get(API_URL + '/car/'+id, {
                headers: token
            })
                .then(async (response) => {
                    if(response.data.length === 0){
                        dispatch(showSnackbar("Nie znaleziono wskazanego auta", false));
                        await delay(2000);
                        navigate("../car/add");
                    } else {
                        setHorsePower(response.data.horsePower);
                        setPrice(response.data.price);
                        setMileage(response.data.mileage);
                        setBrand(response.data.brand.name);
                        setModel(response.data.model.name);
                        setCapacity(response.data.capacity);
                        setFuelType(response.data.fuelType.id);
                        setProductionYear(response.data.year);
                    }
                })
                .catch(async (error) => {
                    console.log(error);
                    dispatch(showSnackbar("Błąd pobierania danych o aucie", false));
                    await delay(2000);
                    navigate('/', {replace: true});
                })
        } else {
            navigate('/', { replace: true });
        }
    };

    const getFuelList = () => {
        axios.get(API_URL + '/fuels')
            .then((response) => {
                if (response.data.length === 0) {
                    dispatch(showSnackbar("Błąd pobierania listy typów paliwa", false));
                    //await delay(2000);
                    navigate('/', {replace: true});
                } else {
                    setFuelList(response.data);
                }
            })
            .catch(async (error) => {
                console.log(error);
                dispatch(showSnackbar("Błąd pobierania listy typów paliwa", false));
                //await delay(2000);
                navigate('/', {replace: true});
            })
    };

    const handleChangeProductionYear = event => {
        const value = Math.max(1970, Math.min(maxYear, Number(event.target.value)));
        setProductionYear(value);
    };

    function getFuelTypeName(name){
        switch(name){
            case "FUEL_GASOLINE": {
                return "Benzyna";
            }
            case "FUEL_HYBRID": {
                return "Hybryda";
            }
            case "FUEL_LPG": {
                return "LPG";
            }
            case "FUEL_DIESEL": {
                return "Diesel";
            }
            case "FUEL_ELECTRIC": {
                return "Elektryczny";
            }
            default: {
                return "Nierozpoznany";
            }
        }
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const editCar = async () => {
        if(horsePower === "" || price === "" || mileage === "" || brand === "" || model === "" || capacity === "" || productionYear === ""){
            dispatch(showSnackbar("Nie wszystkie pola zostały wypełnione!", false));
        }
        else{
            axios.put(API_URL + '/car/'+id, {
                horsePower: horsePower,
                price: price,
                mileage: mileage,
                brand: brand,
                model: model,
                capacity: capacity,
                fuelType: fuelType,
                year: productionYear,
            },{
                headers: token,
            })
                .then(async () => {
                    dispatch(showSnackbar("Pomyślnie zmieniono informacje o aucie", true));
                    await delay(2000);
                    navigate('/', {replace: true});
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(showSnackbar("Błąd podczas zmiany danych auta", false));
                })
        }
    }

    return (
        <Container maxWidth="md">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={10}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} alignItems={"center"}>
                        <Typography variant='h3' align='center'>Edytuj informacje o aucie</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Marka </InputLabel>
                            <TextField value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Model </InputLabel>
                            <TextField value={model} onChange={(e) => setModel(e.target.value)} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Pojemność </InputLabel>
                            <TextField placeholder="np. 1.9" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Konie mechaniczne </InputLabel>
                            <TextField
                                type={"number"}
                                InputProps={{ inputProps: { min: 1, max: 1000 } }}
                                value={horsePower}
                                onChange={(e) => setHorsePower( e.target.value)}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Rok produkcji </InputLabel>
                            <TextField type={"number"} onChange={handleChangeProductionYear} value={productionYear} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Przebieg </InputLabel>
                            <TextField
                                type={"number"}
                                InputProps={{ inputProps: { min: 0 } }}
                                onChange={(e) => setMileage(e.target.value)}
                                value={mileage}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel> Koszt wynajmu za dobę </InputLabel>
                            <TextField
                                type={"number"}
                                InputProps={{ inputProps: { min: 1, max:100 } }}
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <InputLabel>Typ paliwa</InputLabel>
                            <Select
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                required
                            >
                                { fuelList && fuelList.length > 0 && (
                                    fuelList.map((fuel, index) => {
                                        return (
                                            <MenuItem key={index} value={fuel.id}>{getFuelTypeName(fuel.name)}</MenuItem>
                                        );
                                    })
                                )}
                            </Select>
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={editCar} fullWidth>Zapisz zmiany</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default EditCar;