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
import RentalInfoDialog from "../components/RentalInfoDialog";
import ChangeRentalStatusDialog from "../components/ChangeRentalStatusDialog";

const Rentals = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [rentals, setRentals] = useState([]);

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    function getStatusName(name){
        switch(name){
            case "STATUS_PENDING": {
                return "Przetwarzanie";
            }
            case "STATUS_ACCEPTED": {
                return "Zaakceptowany";
            }
            case "STATUS_REJECTED": {
                return "Odrzucony";
            }
            case "STATUS_CANCELLED": {
                return "Anulowany";
            }
            default: {
                return "Nierozpoznany";
            }
        }
    }

    const getRentals = () => {
        axios.get(API_URL + '/rental/get/all',{
            headers: token
        })
            .then((response) => {
                setRentals(response.data)
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas pobierania listy wynajmów");
            })
    };

    const deleteRental = (id) => {
        axios.delete(API_URL + '/rental/delete/'+id, {
            headers: token
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie usunięto wynajem");
                getRentals();
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas usuwania wynajmu!");
            })
    };

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        } else {
            getRentals();
            getStatusList();
        }
    },[userDetails.token]);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getStatusList = () => {
        axios.get(API_URL + '/rental/status/list')
            .then((response) => {
                setStatusList(response.data);
            })
            .catch(async (error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd pobierania statusów wynajmu");
                await delay(2000);
                navigate('/', {replace: true});
            })
    };

    return (
        <Container maxWidth="lg">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Stack spacing={2}>
                    <Typography variant='h4' align='center'>Lista wynajmów</Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Data utworzenia</TableCell>
                                    <TableCell align="center">Okres wynajmu</TableCell>
                                    <TableCell align="center">Auto</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Koszt</TableCell>
                                    <TableCell align="center">Klient</TableCell>
                                    <TableCell align="center">Akcje</TableCell>
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
                                        <TableCell align="center">{rental.car.brand.name + ' ' + rental.car.model.name}</TableCell>
                                        <TableCell align="center">{getStatusName(rental.rentalStatus.name)}</TableCell>
                                        <TableCell align="center">{rental.price + ' zł'}</TableCell>
                                        <TableCell align="center">{rental.user.username}</TableCell>
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
                                            <Button
                                                variant="contained"
                                                color="warning"
                                            >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    deleteRental(rental.id);
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

export default Rentals;