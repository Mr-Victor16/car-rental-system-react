import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Divider, Typography, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../reducers/userDetailsReducer";
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminMenuList from "../components/AdminMenuList";

const MenuItemsList = ({ items, onItemClick }) => (
    <List>
        {items.map((item, index) => (
            item.condition !== false && (
                <ListItemButton key={index} component={Link} to={item.link} onClick={onItemClick}>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            )
        ))}
    </List>
);

const Navigation = () => {
    const navigate = useNavigate();
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const logOut = () => {
        dispatch(logout());
        navigate('/', { replace: true });
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const menuItems = [
        { text: 'Home', link: 'home' },
        { text: 'My rentals', link: 'my-rentals', condition: userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN') },
        { text: 'My profile', link: 'profile', condition: userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN') },
        { text: 'Login', link: 'login', condition: !userDetails.roles.includes('ROLE_USER') && !userDetails.roles.includes('ROLE_ADMIN') },
        { text: 'Register', link: 'register', condition: !userDetails.roles.includes('ROLE_USER') && !userDetails.roles.includes('ROLE_ADMIN') },
    ];

    const adminMenuItems = [
        { text: 'Car list', link: 'car/list' },
        { text: 'Rental list', link: 'rentals' },
        { text: 'User list', link: 'users' },
    ];

    const renderDrawer = () => (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <MenuItemsList items={menuItems} />
            {(userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN')) && (
                <ListItemButton onClick={logOut}>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            )}
            {userDetails.roles.includes('ROLE_ADMIN') && (
                <>
                    <Divider />
                    <ListItem sx={{ backgroundColor: '#f0f0f0' }}>
                        <ListItemText primary={<Typography variant="subtitle1" fontWeight="bold">Administrator</Typography>} />
                    </ListItem>
                    <MenuItemsList items={adminMenuItems} />
                </>
            )}
        </Box>
    );

    return (
        <>
            {isSmallScreen ? (
                <>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                        {renderDrawer()}
                    </Drawer>
                </>
            ) : (
                <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between' }}>
                    {menuItems.map((item, index) => (
                        item.condition !== false && (
                            <Button key={index} component={Link} sx={{ my: 2, color: 'white', display: 'block' }} to={item.link}>
                                {item.text}
                            </Button>
                        )
                    ))}
                    {userDetails.roles.includes('ROLE_ADMIN') && <AdminMenuList />}
                    {(userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN')) && (
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={logOut}>
                            Logout
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};

export default Navigation;