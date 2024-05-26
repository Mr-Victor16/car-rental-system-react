import React, { useEffect, useState } from "react";
import axios from '../lib/axiosConfig';
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button, useMediaQuery, Grid, Card, CardContent, CardActions} from '@mui/material';
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import DeleteIcon  from '@mui/icons-material/Delete';
import RentalInfoDialog from "../components/CarRental/RentalInfoDialog";
import ChangeRentalStatusDialog from "../components/CarRental/ChangeRentalStatusDialog";
import {showSnackbar} from "../actions/snackbarActions";
import {getStatusName} from "../helpers/rentalStatusNames";
import CarRentalDialog from "../components/CarRental/CarRentalDialog";
import EditIcon from "@mui/icons-material/Edit";

const Rentals = () => {
    const dispatch = useDispatch();
    const token = AuthHeader();
    let navigate = useNavigate();
    const [statusList, setStatusList] = useState([]);
    const [rentals, setRentals] = useState([]);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    const getRentals = () => {
        axios.get('rentals',{
            headers: token
        })
            .then((response) => {
                setRentals(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while fetching the list of rentals", false));
            })
    };

    const deleteRental = (id) => {
        axios.delete('rental/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Rental deleted successfully", true));
                getRentals();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while deleting the rental", false));
            })
    };

    useEffect(() => {
        getRentals();
        getStatusList();
    },[]);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getStatusList = () => {
        axios.get('rental-statuses')
            .then(async (response) => {
                if (response.data.length === 0) {
                    dispatch(showSnackbar("Error occurred while retrieving the list of rental statuses", false));
                    await delay(2000);
                    navigate('/', {replace: true});
                } else {
                    setStatusList(response.data);
                }
            })
            .catch(async (error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while retrieving the list of rental statuses", false));
                await delay(2000);
                navigate('/', {replace: true});
            })
    };

    const updateRentalInList = (rentalID, updatedRental) => {
        setRentals(prevRentals => prevRentals.map(rental => rental.id === rentalID ? { ...rental, startDate: updatedRental.startDate, endDate: updatedRental.endDate } : rental));
    };

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
                <Typography variant='h4' align='center'>Rental list</Typography>
                <Stack sx={{ whiteSpace: 'nowrap' }}>
                    {isSmallScreen ? (
                        <Grid container spacing={2}>
                            {rentals && rentals.length > 0 ? (
                                rentals.map((rental) => (
                                    <Grid item xs={12} key={rental.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{rental.carBrand + ' ' + rental.carModel} ({rental.addDate})</Typography>
                                                <Typography variant="body2" color="textSecondary">Customer: {rental.username}</Typography>
                                                <Typography variant="body2" color="textSecondary">Cost: {rental.price + ' PLN'}</Typography>
                                                <Typography variant="body2" color="textSecondary">Rental period: {rental.startDate + ' - ' + rental.endDate}</Typography>
                                                <Typography variant="body2" color="textSecondary">Status: {getStatusName(rental.rentalStatus.name)}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <RentalInfoDialog statusHistory={rental.statusHistory} />
                                                &nbsp;
                                                <ChangeRentalStatusDialog
                                                    setRentals={[setRentals]}
                                                    statusList={statusList}
                                                    status={rental.rentalStatus}
                                                    rentalID={rental.id}
                                                />
                                                &nbsp;
                                                <CarRentalDialog
                                                    rentalID={rental.id}
                                                    startDate={rental.startDate}
                                                    endDate={rental.endDate}
                                                    price={rental.carPrice}
                                                    icon={<EditIcon fontSize="small" />}
                                                    updateRentalInList={updateRentalInList}
                                                />
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        deleteRental(rental.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="h6" align="center" style={{ marginTop: '50px', textAlign: 'center', display: 'block', width: '100%' }}>
                                    No rentals to display
                                </Typography>
                            )}
                        </Grid>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="center">Date created</TableCell>
                                        <TableCell align="center">Rental period</TableCell>
                                        <TableCell align="center">Car</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">Cost</TableCell>
                                        <TableCell align="center">Customer</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rentals && rentals.length > 0 ? (
                                        rentals.map((rental, index) => (
                                        <TableRow
                                            key={rental.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {index+1}
                                            </TableCell>
                                            <TableCell align="center">{rental.addDate}</TableCell>
                                            <TableCell align="center">{rental.startDate + ' - ' + rental.endDate}</TableCell>
                                            <TableCell align="center">{rental.carBrand + ' ' + rental.carModel}</TableCell>
                                            <TableCell align="center">{getStatusName(rental.rentalStatus.name)}</TableCell>
                                            <TableCell align="center">{rental.price + ' PLN'}</TableCell>
                                            <TableCell align="center">{rental.username}</TableCell>
                                            <TableCell align="center">
                                                <RentalInfoDialog statusHistory={rental.statusHistory} />
                                                &nbsp;
                                                <ChangeRentalStatusDialog
                                                    setRentals={[setRentals]}
                                                    statusList={statusList}
                                                    status={rental.rentalStatus}
                                                    rentalID={rental.id}
                                                />
                                                &nbsp;
                                                <CarRentalDialog
                                                    rentalID={rental.id}
                                                    startDate={rental.startDate}
                                                    endDate={rental.endDate}
                                                    price={rental.carPrice}
                                                    icon={<EditIcon fontSize="small" />}
                                                    updateRentalInList={updateRentalInList}
                                                />
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        deleteRental(rental.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))) : (
                                        <TableRow><TableCell colSpan={8}><h2 align="center">No rentals to display</h2></TableCell></TableRow>
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

export default Rentals;