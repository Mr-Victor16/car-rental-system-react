import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import React, {useState} from "react";
import InfoIcon from "@mui/icons-material/Info";
import FuelIcon from '@mui/icons-material/LocalGasStation';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import CarIcon from '@mui/icons-material/AirportShuttle';
import ServiceIcon from '@mui/icons-material/MiscellaneousServices';
import GridItem from "./GridItem";
import {getFuelTypeName} from "../helpers/fuelTypes";

export default function CarInfoDialog(props){
    const [openDialog, setOpenDialog] = useState(false);
    const [car] = useState(props.carInfo);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <InfoIcon fontSize="small" />
            </Button>

            <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{car.brand.name + ' ' + car.model.name + ' (' + car.year + ')'}</DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} align={"center"}>
                            <img
                                src={"data:image/jpeg;base64,"+car.carImage.fileContent}
                                style={{width: 'auto', height: 'auto', maxHeight: 250, maxWidth: '100%', margin: '0 auto'}}
                                alt={car.brand.name + ' ' + car.model.name + ' photo'}
                                loading="lazy"
                            />
                        </Grid>

                        <GridItem xs={12} md={6} icon={<FuelIcon />} primaryText={"Fuel"} secondaryText={getFuelTypeName(car.fuelType.name)} />
                        <GridItem xs={12} md={6} icon={<ServiceIcon />} primaryText={"Mileage"} secondaryText={car.mileage + ' km'} />
                        <GridItem xs={12} md={6} icon={<CarIcon />} primaryText={"Engine"} secondaryText={car.capacity + ', ' + car.horsePower + ' HP'} />
                        <GridItem xs={12} md={6} icon={<MoneyIcon />} primaryText={"Price per day"} secondaryText={car.price + ' PLN'} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}