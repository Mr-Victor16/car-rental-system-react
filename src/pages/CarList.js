import React, { useEffect, useState } from "react";
import axios from "axios";
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarInfoDialog from "../components/CarInfoDialog";
import {showSnackbar} from "../actions/snackbarActions";

const CarList = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [cars, setCars] = useState([]);

    function getStatusName(name){
        switch(name){
            case true: {
                return "Tak";
            }
            case false: {
                return "Nie";
            }
            default: {
                return "Nierozpoznany";
            }
        }
    }

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

    const getCars = () => {
        axios.get(API_URL + '/cars',{
            headers: token
        })
            .then((response) => {
                setCars(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Błąd podczas pobierania listy aut", false));
            })
    };

    const deleteCar = (id) => {
        axios.delete(API_URL + '/car/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Pomyślnie usunięto auto", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Błąd podczas usuwania auta", false));
            })
    };

    const changeCarStatus = (id) => {
        axios.put(API_URL + '/car/'+id+'/status', {}, {
            headers: token
        })
            .then(() => {
                dispatch(showSnackbar("Pomyślnie zmieniono status dostępności auta", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Wystąpił błąd podczas zmiany statusu dostępności auta", false));
            })
    };

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        } else {
            getCars();
        }
    },[userDetails.token]);

    return (
        <Container maxWidth="lg">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Typography variant='h4' align='center'>Lista aut</Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/car/add')
                    }}
                >
                    Dodaj auto
                </Button>
                <Stack spacing={2}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Model i marka</TableCell>
                                    <TableCell align="center">Rok produkcji</TableCell>
                                    <TableCell align="center">Typ paliwa</TableCell>
                                    <TableCell align="center">Cena</TableCell>
                                    <TableCell align="center">Dostępny</TableCell>
                                    <TableCell align="center">Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cars && cars.length > 0 ? (
                                    cars.map((car, index) => (
                                        <TableRow
                                            key={car.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{index+1}</TableCell>
                                            <TableCell align="center">{car.brand.name + ' ' + car.model.name}</TableCell>
                                            <TableCell align="center">{car.year}</TableCell>
                                            <TableCell align="center">{getFuelTypeName(car.fuelType.name)}</TableCell>
                                            <TableCell align="center">{car.price + ' zł'}</TableCell>
                                            <TableCell align="center">{getStatusName(car.available)}</TableCell>
                                            <TableCell align="center">
                                                <ChangeImageDialog carID={car.id} cars={[setCars]} />
                                                &nbsp;
                                                <CarInfoDialog carInfo={car} />
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        changeCarStatus(car.id);
                                                    }}
                                                >
                                                    <ChangeCircleIcon fontSize="small" />
                                                </Button>
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))) : (
                                    <TableRow><TableCell colSpan={8}><h2 align="center">Brak danych do wyświetlenia</h2></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Box>
        </Container>
    );
};

export default CarList;