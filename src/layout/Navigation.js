import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import AuthService from '../services/AuthService';

const Navigation = () => {
    const [ user, setUser ] = useState('');
    const [ moderator, setModerator ] = useState(false);
    const [ admin, setAdmin ] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        
        if (currentUser) {
            setModerator(currentUser.roles.includes("ROLE_MODERATOR"));
            setAdmin(currentUser.roles.includes("ROLE_ADMIN"));
            setUser(currentUser);
        }
    }, [JSON.parse(localStorage.getItem("user"))] );

    const logOut = () => {
        AuthService.logout();
        
        setModerator(false);
        setAdmin(false);
        setUser(undefined);
        
        navigate('/', { replace: true });
    };

    return(
        <>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                <Button
                    component={Link}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    to="home"
                >
                    Home
                </Button>
            </Box>

            {!user && (
                <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to="login"
                        >
                            Zaloguj się
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to="register"
                        >
                            Zarejestruj się
                        </Button>
                    </Box>
                </>
            )}

            {user && (
                <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to="profile"
                        >
                            Profil
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            onClick={logOut}
                        >
                            Wyloguj się
                        </Button>
                    </Box>
                </>
            )}
        </>
    )
};

export default Navigation;