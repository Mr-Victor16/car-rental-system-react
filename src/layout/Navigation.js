import { Link, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../store/userDetailsReducer";
import AdminMenuList from "../components/AdminMenuList";

const Navigation = () => {
    let navigate = useNavigate();
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();

    const logOut = () => {
        dispatch(logout());
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
                    Strona główna
                </Button>
            </Box>

            {userDetails.roles.includes("ROLE_ADMIN") && (
                <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <AdminMenuList />
                    </Box>
                </>
            )}

            {(userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN')) ? (
                <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to="my-rentals"
                        >
                            Moje wynajmy
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to="profile"
                        >
                            Mój profil
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
            ) : (
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
        </>
    )
};

export default Navigation;