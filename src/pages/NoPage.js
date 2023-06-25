import {Box, Typography} from "@mui/material";
import React from "react";

const NoPage = () => {
    return (
        <Box marginTop={20}>
            <Typography variant='h4' align='center'>Strona o podanym adresie nie istnieje!</Typography>
        </Box>
    );
};
  
export default NoPage;