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
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
    Snackbar,
    Alert,
    InputLabel,
    TextField,
    FormGroup
} from "@mui/material";
import ImageIcon  from '@mui/icons-material/Image';
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import AuthHeader from "../services/authHeader";
const API_URL = "http://localhost:8080/api";

const Home = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const token = AuthHeader();

    const [open, setOpen] = useState(false);
    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [carPrice, setCarPrice] = useState(0);
    const [rentalCost, setRentalCost] = useState(0);
    const [carID, setCarID] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        getCarsList();
    }, []);

    useEffect(() => {
        handleChangeRentalDate();
    }, [rentalStartDate, rentalEndDate]);

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenRentalDialog = () => {
        setOpenRentalDialog(true);
    };

    const handleCloseRentalDialog = () => {
        setOpenRentalDialog(false);
    };

    const handleChangeRentalDate = () => {
        if(rentalStartDate !== "" && rentalEndDate !== ""){
            let startDate = new Date(rentalStartDate);
            let endDate = new Date(rentalEndDate);

            if (endDate < startDate) {
                setRentalStartDate(rentalEndDate);
            } else {
                let difference = endDate.getTime() - startDate.getTime();
                setRentalCost(carPrice * (Math.ceil(difference / (1000 * 3600 * 24))+1));
            }
        }
    };

    const handleCloseError = async () => {
        setError(false);
    }

    const handleCloseSuccess = async () => {
        setSuccess(false);
    }

    const onFileUpload = async () => {
        const formData = new FormData();

        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );

        formData.append("carID", carID);

        if (userDetails.token !== "") {
            axios.post(API_URL + '/cars/change-image', formData, {
                    headers: token
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

    const addCarRental = async () => {
        if (userDetails.token !== "") {
            axios.post(API_URL + '/rental/add', {
                startDate: rentalStartDate,
                endDate: rentalEndDate,
                addDate: new Date().toISOString().slice(0, 10),
                carID: carID,
                userID: userDetails.id
            },{
                headers: token
            })
                .then(async () => {
                    setError(false);
                    setSuccess(true);
                    setInfo("Pomyślnie wysłano zapytanie o wynajem auta");
                    setOpenRentalDialog(false);
                })
                .catch((error) => {
                    console.log(error);
                    setError(true);
                    setInfo("Błąd podczas wynajmu auta!");
                })
        }
    };

    const deleteCar = async (id) => {
        if ((userDetails.token !== "") && (userDetails.roles.includes("ROLE_ADMIN"))) {
            axios.delete(API_URL + '/cars/delete/'+id, {
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
        }
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
                                        {userDetails.token !== "" && (
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setCarID(car.id);
                                                    setCarPrice(car.price);
                                                    handleClickOpenRentalDialog();
                                                }}
                                            >
                                                Wynajmij
                                            </Button>
                                        )}

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
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
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

            <Dialog open={openRentalDialog} onClose={handleCloseRentalDialog}>
                <DialogTitle>Wynajmij auto</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wybierz okres wynajmu, a następnie zatwierdź zmiany przyciskiem.
                    </DialogContentText>
                    <FormGroup>
                        <InputLabel> Początek wynajmu </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalStartDate(e.target.value);
                            }}
                            value={rentalStartDate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel> Koniec wynajmu </InputLabel>
                        <TextField
                            type={"date"}
                            onChange={(e) => {
                                setRentalEndDate(e.target.value);
                            }}
                            value={rentalEndDate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel> Koszt wynajmu </InputLabel>
                        <TextField
                            value={ rentalCost + ' zł'}
                            readOnly
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addCarRental}>Wynajmij</Button>
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