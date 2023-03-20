import { useState, useEffect } from "react";
import axios from "axios";
import AccountPics from "../images/blank-profile-picture.png";
import { TextField, Typography, Box, Stack, Container, FormGroup, InputLabel } from '@mui/material';
const API_URL = "http://localhost:8080/api/profile";

const Profile = () => {
    const [userDetails, setUserDetails] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user'))){
            axios.get(API_URL + '/my', { method: 'GET',
            mode: 'cors',
                headers: { token: JSON.parse(localStorage.getItem('user')).token },
            })
                
            .then((response) => {
                setUserDetails(response.data);
                console.log(response.data);
                return response.data;
            })
            .catch(() => {
                setError(true);
            })
        } else {
            setError(true);
        }
    }, []);

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >

                {!error && (
                    <Stack spacing={2}>
                        <img
                            src={AccountPics}
                            style={{ width: 200, height: 200, borderRadius: 200 / 2, alignSelf: 'center' }} 
                            alt="Profile avatar"
                            loading="lazy"
                        />
            
                        <Typography variant='h3' align='center'>{userDetails.username}</Typography>

                        <FormGroup>
                            <InputLabel>
                                Adres e-mail
                            </InputLabel>
                            <TextField
                                value={userDetails.email}
                                readOnly
                            />
                        </FormGroup>
                    
                        {/* <Button variant="contained" onClick={edit}>Edytuj</Button> */}
                    </Stack>
                )}

                {error && (
                    <Typography variant='h4' align='center'>Brak profilu do wyświetlenia</Typography>
                )}
            </Box>    
        </Container>
    );
};
  
export default Profile;