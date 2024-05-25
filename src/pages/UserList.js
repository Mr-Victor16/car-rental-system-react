import React, { useEffect, useState } from "react";
import axios from '../lib/axiosConfig';
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button, Card, CardContent, CardActions, Grid, useMediaQuery} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import DeleteIcon  from '@mui/icons-material/Delete';
import {showSnackbar} from "../actions/snackbarActions";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {logout} from "../reducers/userDetailsReducer";
import {getUserTypeName} from "../helpers/userTypes";

const UserList = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();
    let navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const getUsers = () => {
        axios.get('user',{
            headers: token
        })
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error while fetching the list of users", false));
            })
    };

    const deleteUser = (id) => {
        axios.delete('user/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("User successfully deleted", true));
                getUsers();
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified user was not found", false));
                } else if (error.response.status === 403) {
                    dispatch(showSnackbar("Default administrator account cannot be deleted", false));
                } else {
                    dispatch(showSnackbar("Error occurred while deleting the user", false));
                }
            })
    };

    const changeUserRole = (idUser, idRole) => {
        const role = idRole === 1 ? "user" : "admin";

        axios.put('user/'+idUser+'/role/'+role, {}, {
            headers: token
        })
            .then(() => {
                dispatch(showSnackbar("User role changed successfully", true));
                idUser === userDetails.id ? dispatch(logout()) : getUsers();
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified user was not found", false));
                } else if (error.response.status === 403) {
                    dispatch(showSnackbar("Role of the default administrator account cannot be changed", false));
                } else {
                    dispatch(showSnackbar("Error occurred while changing user role", false));
                }
            })
    };

    useEffect(() => {
        getUsers();
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
                <Typography variant='h4' align='center'>User list</Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={() => {
                        navigate('/user/add')
                    }}
                >
                    Add user
                </Button>
                <Stack sx={{ whiteSpace: 'nowrap' }}>
                    {isSmallScreen ? (
                        <Grid container spacing={2}>
                            {users && users.length > 1 ? (
                                users
                                    .filter(user => user.id !== 1)
                                    .map((filteredUser) => (
                                        <Grid item xs={12} key={filteredUser.id}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6">{filteredUser.username}</Typography>
                                                    <Typography variant="body2" color="textSecondary">E-mail: {filteredUser.email}</Typography>
                                                    <Typography variant="body2" color="textSecondary">Role: {getUserTypeName(filteredUser.role.name)}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() => {
                                                            changeUserRole(filteredUser.id, filteredUser.role.id);
                                                        }}
                                                    >
                                                        <BookmarkIcon fontSize="small" />
                                                    </Button>
                                                    &nbsp;
                                                    {userDetails.id !== filteredUser.id &&
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => {
                                                                deleteUser(filteredUser.id);
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </Button>
                                                    }
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                            ) : (
                                <Typography variant="h6" align="center">No users to display</Typography>
                            )}
                        </Grid>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="center">Username</TableCell>
                                        <TableCell align="center">E-mail</TableCell>
                                        <TableCell align="center">Role</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users && users.length > 1 ? (
                                        users
                                            .filter(user => user.id !== 1)
                                            .map((filteredUser, index) => (
                                                <TableRow
                                                    key={filteredUser.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">{index+1}</TableCell>
                                                    <TableCell align="center">{filteredUser.username}</TableCell>
                                                    <TableCell align="center">{filteredUser.email}</TableCell>
                                                    <TableCell align="center">{getUserTypeName(filteredUser.role.name)}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => {
                                                                changeUserRole(filteredUser.id, filteredUser.role.id);
                                                            }}
                                                        >
                                                            <BookmarkIcon fontSize="small" />
                                                        </Button>
                                                        &nbsp;
                                                        {userDetails.id !== filteredUser.id &&
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => {
                                                                    deleteUser(filteredUser.id);
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))) : (
                                        <TableRow><TableCell colSpan={8}><h2 align="center">No users to display</h2></TableCell></TableRow>
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

export default UserList;