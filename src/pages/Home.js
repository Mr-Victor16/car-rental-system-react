import {useEffect, useState} from "react";
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
    Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';
const API_URL = "http://localhost:8080/api/cars";

const Home = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get(API_URL + '/available', { method: 'GET',
            mode: 'cors'
        })
            .then((response) => {
                setCars(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

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
                                            <Item>Silnik: {car.capacity + ", " + car.horse_power + "KM"}</Item>
                                            <Item>Paliwo: {getFuelTypeName(car.fuelType.name)}</Item>
                                            <Item>Cena za dobę: {car.price + "zł"}</Item>
                                        </Stack>
                                    </CardContent>
                                    <CardActions style={{justifyContent: 'center'}}>
                                        {JSON.parse(localStorage.getItem('user')) !== null && (<Button variant="contained">Wynajmij auto</Button>)}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <h1>Brak danych do wyświetlenia</h1>
                )}
            </Grid>
        </>
    );
};
  
export default Home;