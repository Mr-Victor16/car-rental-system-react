import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Stack,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import AuthHeader from "../services/authHeader";
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarRentalDialog from "../components/CarRentalDialog";
const API_URL = "http://localhost:8080/api";

const Home = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    const [cars, setCars] = useState([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        getCarsList();
    }, []);

    const getCarsList = async () => {
        axios.get(API_URL + '/cars/available')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    const deleteCar = async (id) => {
        axios.delete(API_URL + '/car/'+id, {
            headers: token
        })
            .then(async () => {
                setError(false);
                setSuccess(true);
                setInfo("Pomyślnie usunięto auto");
                await getCarsList();
            })
            .catch((error) => {
                console.log(error);
                setError(true);
                setInfo("Błąd podczas usuwania auta!");
            })
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

    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={5}>
                {cars && cars.length > 0 ? (
                    cars.map((car, index) => {
                        return (
                            <Grid item xs={3} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        alt={car.brand.name + car.model.name}
                                        height="250"
                                        image={"data:image/jpeg;base64,"+car.carImage.fileContent}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" textAlign="center">
                                            {car.brand.name + " " + car.model.name + " (" + car.year + ")"}
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Item>Przebieg: {car.mileage} km</Item>
                                            <Item>Silnik: {car.capacity + ", " + car.horsePower + "KM"}</Item>
                                            <Item>Paliwo: {getFuelTypeName(car.fuelType.name)}</Item>
                                            <Item>Cena za dobę: {car.price + "zł"}</Item>
                                        </Stack>
                                    </CardContent>
                                    <CardActions style={{justifyContent: 'center'}}>
                                        {userDetails.token !== "" && (
                                            <CarRentalDialog carID={car.id} price={car.price} />
                                        )}

                                        {userDetails.roles.includes("ROLE_ADMIN") && (
                                            <>
                                                &nbsp;
                                                <ChangeImageDialog carID={car.id} cars={[setCars]} />

                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12} marginTop={20}>
                        <Typography variant='h4' align='center'>Brak danych do wyświetlenia</Typography>
                    </Grid>
                )}
            </Grid>

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
        </>
    );
};
  
export default Home;