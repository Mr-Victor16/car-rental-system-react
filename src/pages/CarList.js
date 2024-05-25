import React, { useEffect, useState } from "react";
import axios from '../lib/axiosConfig';
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button, Card, CardContent, Grid, CardActions} from '@mui/material';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import AuthHeader from "../services/authHeader";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarInfoDialog from "../components/CarInfoDialog";
import {showSnackbar} from "../actions/snackbarActions";
import {getFuelTypeName} from "../helpers/fuelTypes";
import {getCarStatusName} from "../helpers/carStatusNames";
import useMediaQuery from "@mui/material/useMediaQuery";

const CarList = () => {
    const dispatch = useDispatch();
    const token = AuthHeader();
    let navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    const getCars = () => {
        axios.get('cars',{
            headers: token
        })
            .then((response) => {
                setCars(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error while fetching the list of cars", false));
            })
    };

    const deleteCar = (id) => {
        axios.delete('car/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car successfully deleted", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while deleting the car", false));
            })
    };

    const changeCarStatus = (id) => {
        axios.put('car/'+id+'/status', {}, {
            headers: token
        })
            .then(() => {
                dispatch(showSnackbar("Car availability status changed successfully", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while changing the availability status of the car", false));
            })
    };

    useEffect(() => {
        getCars();
    },[]);

    return (
        <Container maxWidth="lg">
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
                <Typography variant='h4' align='center'>Car list</Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={() => {
                        navigate('/car/add')
                    }}
                >
                    Add car
                </Button>
                <Stack spacing={2}>
                    {isSmallScreen ? (
                        <Grid container spacing={2}>
                            {cars && cars.length > 0 ? (
                                cars.map((car) => (
                                    <Grid item xs={12} key={car.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{car.brand.name + ' ' + car.model.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">Production year: {car.year}</Typography>
                                                <Typography variant="body2" color="textSecondary">Fuel type: {getFuelTypeName(car.fuelType.name)}</Typography>
                                                <Typography variant="body2" color="textSecondary">Price: {car.price} PLN/day</Typography>
                                                <Typography variant="body2" color="textSecondary">Available: {getCarStatusName(car.available)}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <ChangeImageDialog carID={car.id} cars={[setCars]} />
                                                <CarInfoDialog carInfo={car} />
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => {
                                                        changeCarStatus(car.id);
                                                    }}
                                                >
                                                    <ChangeCircleIcon fontSize="small" />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="h6" align="center">No cars to display</Typography>
                            )}
                        </Grid>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="center">Brand and model</TableCell>
                                        <TableCell align="center">Production year</TableCell>
                                        <TableCell align="center">Fuel type</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        <TableCell align="center">Available</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cars && cars.length > 0 ? (
                                        cars.map((car, index) => (
                                            <TableRow
                                                key={car.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                                <TableCell align="center">{car.brand.name + ' ' + car.model.name}</TableCell>
                                                <TableCell align="center">{car.year}</TableCell>
                                                <TableCell align="center">{getFuelTypeName(car.fuelType.name)}</TableCell>
                                                <TableCell align="center">{car.price + ' PLN/day'}</TableCell>
                                                <TableCell align="center">{getCarStatusName(car.available)}</TableCell>
                                                <TableCell align="center">
                                                    <ChangeImageDialog carID={car.id} cars={[setCars]} />
                                                    &nbsp;
                                                    <CarInfoDialog carInfo={car} />
                                                    &nbsp;
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
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
                                                        size="small"
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
                                                        size="small"
                                                        onClick={() => {
                                                            deleteCar(car.id);
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                        <TableRow><TableCell colSpan={8}><Typography variant="h6" align="center">No cars to display</Typography></TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </Box>
        </Container>
    );
};

export default CarList;