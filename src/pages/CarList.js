import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography, Box, Stack, Container, Alert, Snackbar, TableRow,
    TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button
} from '@mui/material';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarInfoDialog from "../components/CarInfoDialog";

const CarList = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");

    const [cars, setCars] = useState([]);

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

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
        axios.get(API_URL + '/cars/all',{
            headers: token
        })
            .then((response) => {
                setCars(response.data)
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas pobierania listy aut");
            })
    };

    const deleteCar = (id) => {
        axios.delete(API_URL + '/cars/delete/'+id, {
            headers: token
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie usunięto auto");
                getCars();
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas usuwania auta!");
            })
    };

    const changeCarStatus = (id) => {
        axios.post(API_URL + '/cars/status/'+id, {}, {
            headers: token
        })
            .then(() => {
                setSuccess(true);
                setInfo("Pomyślnie zmieniono status dostępności auta");
                getCars();
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Wystąpił błąd podczas zmiany statusu dostępności auta");
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
                                    <TableRow><TableCell colspan={8}><h2 align="center">Brak danych do wyświetlenia</h2></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Box>

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

export default CarList;