import {Box, Typography} from "@mui/material";
import React from "react";

const NoPage = () => {
    return (
        <Box marginTop={20}>
            <Typography variant='h5' align='center'>You don't have permission to view this page!</Typography>
        </Box>
    );
};
  
export default NoPage;