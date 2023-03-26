import { useEffect } from "react";
import AccountPics from "../images/blank-profile-picture.png";
import { TextField, Typography, Box, Stack, Container, FormGroup, InputLabel } from '@mui/material';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const userDetails = useSelector((state) => state.userDetails);
    let navigate = useNavigate();

    useEffect(() => {
        if (userDetails.token === "") {
            navigate('/', {replace: true});
        }
    });

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
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
            </Box>    
        </Container>
    );
};
  
export default Profile;