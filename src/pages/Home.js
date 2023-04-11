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
    Paper, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, Snackbar, Alert
} from "@mui/material";
import ImageIcon  from '@mui/icons-material/Image';
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
const API_URL = "http://localhost:8080/api/cars";

const Home = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const [open, setOpen] = useState(false);
    const [carID, setCarID] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");

    useEffect(() => {
        getCarsList();
    }, []);

    const getCarsList = () => {
        axios.get(API_URL + '/available', { method: 'GET',
            mode: 'cors'
        })
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    const onFileUpload = () => {
        const formData = new FormData();

        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );

        formData.append("carID", carID);
        formData.append("token", userDetails.token);

        if (userDetails.token !== "") {
            axios.post(API_URL + '/change-image', formData, carID, userDetails.token, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(async () => {
                    setError(false);
                    setSuccess(true);
                    setInfo("Pomyślnie zmieniono zdjęcie");
                    setOpen(false);
                    getCarsList();
                })
                .catch((error) => {
                    console.log(error);
                    setError(true);
                    setInfo("Błąd podczas zmiany zdjęcia!");
                })
        }
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
                                            <Item>Silnik: {car.capacity + ", " + car.horse_power + "KM"}</Item>
                                            <Item>Paliwo: {getFuelTypeName(car.fuelType.name)}</Item>
                                            <Item>Cena za dobę: {car.price + "zł"}</Item>
                                        </Stack>
                                    </CardContent>
                                    <CardActions style={{justifyContent: 'center'}}>
                                        {userDetails.token !== "" && (<Button variant="contained">Wynajmij auto</Button>)}

                                        {userDetails.roles.includes("ROLE_ADMIN") && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        setCarID(car.id);
                                                        handleClickOpen();
                                                    }}
                                                >
                                                    <ImageIcon />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                >
                                                    <EditIcon />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <h1>Brak danych do wyświetlenia</h1>
                )}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Zmień zdjęcie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wybierz nowe zdjęcie auta, a następnie zatwierdź zmiany przyciskiem.
                    </DialogContentText>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onFileUpload}>Zatwierdź zmianę</Button>
                </DialogActions>
            </Dialog>

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