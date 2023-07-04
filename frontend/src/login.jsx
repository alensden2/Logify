import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Form from "./components/Form";
import Navbar from "./components/navbar";

function Login() {
    const navigate = useNavigate();
    const handleSignUpClick = (event) => {
        event.preventDefault();
        navigate('/register');
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
                    <Form isLogin={true} />
                    <Typography variant="body2" onClick={handleSignUpClick} component="p" sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center',  color: 'blue', textDecoration: 'underline'}}>
                        New to the site? Sign up here!
                    </Typography>
                </Box>

            </Box>
        </div>
    </>
}

export default Login;