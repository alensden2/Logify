import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Form from "./components/Form";
import Navbar from "./components/navbar";


function Register() {
    const navigate = useNavigate();
    const handleSignInClick = (event) => {
        event.preventDefault();
        navigate('/');
    };
    return <>
        <div style={{ backgroundColor: '#d9d9d9', minHeight: '100vh' }}>
            <Navbar />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="calc(100vh - 64px)"
            >
                <Box sx={{ gap: '20px', textAlign: 'center' }}>
                    <Form isLogin={false} />
                    <Typography variant="body2" component="p" onClick={handleSignInClick} sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' ,  color: 'blue', textDecoration: 'underline'}}>
                        Already Signed up? Sign in here!
                    </Typography>
                </Box>
            </Box>
        </div>

    </>
}

export default Register;

/** */