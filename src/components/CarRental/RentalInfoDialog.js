import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItem, List, ListItemText} from "@mui/material";
import React, {useState} from "react";
import InfoIcon from "@mui/icons-material/Info";
import {getStatusName} from "../../helpers/rentalStatusNames";

export default function RentalInfoDialog(props){
    const [openDialog, setOpenDialog] = useState(false);
    const [rentalHistory] = useState(props.statusHistory);

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

            <Dialog open={openDialog} onClose={handleClose} maxWidth={"xs"} fullWidth>
                <DialogTitle>Status change history</DialogTitle>

                <DialogContent>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {rentalHistory && rentalHistory.length > 0 ? (
                            rentalHistory.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText primary={getStatusName(item.statusAfterChange.name)} secondary={item.changeDate} />
                                    </ListItem>
                                    { rentalHistory.length === 0 && <Divider variant="inset" component="li" /> }
                                </React.Fragment>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText align="center" primary={"No data to display"} />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}