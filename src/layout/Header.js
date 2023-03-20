import React from 'react';
import { Toolbar, Typography } from '@mui/material';
import CarRentalIcon from '@mui/icons-material/CarRental';
import Navigation from './Navigation';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Toolbar disableGutters>
            <CarRentalIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} />
            <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none'
                }}
            >
                Car Rental System
            </Typography>
            
            <Navigation />
        </Toolbar>
    );
};

export default Header;