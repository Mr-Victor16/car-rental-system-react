import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import FuelIcon from '@mui/icons-material/LocalGasStation';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import CarIcon from '@mui/icons-material/AirportShuttle';
import ServiceIcon from '@mui/icons-material/MiscellaneousServices';
import GridItem from "./GridItem";

export default function CarInfoDialog(props){
    const userDetails = useSelector((state) => state.userDetails);

    const [openDialog, setOpenDialog] = useState(false);
    const [car] = useState(props.carInfo);
    let navigate = useNavigate();

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        }
    },[userDetails.token]);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
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
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <InfoIcon fontSize="small" />
            </Button>

            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>{car.brand.name + ' ' + car.model.name + ' (' + car.year + ')'}</DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} align={"center"}>
                            <img
                                src={"data:image/jpeg;base64,"+car.carImage.fileContent}
                                height={250}
                                alt={car.brand.name + ' ' + car.model.name + ' photo'}
                                loading="lazy"
                            />
                        </Grid>

                        <GridItem xs={4} md={6} icon={<FuelIcon />} primaryText={"Paliwo"} secondaryText={getFuelTypeName(car.fuelType.name)} />
                        <GridItem xs={4} md={6} icon={<ServiceIcon />} primaryText={"Przebieg"} secondaryText={car.mileage + ' km'} />
                        <GridItem xs={4} md={6} icon={<CarIcon />} primaryText={"Silnik"} secondaryText={car.capacity + ', ' + car.horse_power + ' KM'} />
                        <GridItem xs={4} md={6} icon={<MoneyIcon />} primaryText={"Cena"} secondaryText={car.price + ' zł'} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}