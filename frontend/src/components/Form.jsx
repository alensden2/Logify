import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Form({ isLogin }) {
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');

    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [isFormValid, setIsFormValid] = useState(false);

    const navigate = useNavigate();


    const validateFirstName = (name) => {
        const regex = /^[A-Za-z]+$/;
        return regex.test(name);
    };

    const validateEmail = (email) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-zA-Z0-9])(?=.*[@#$%^&+=]).{8,}$/;
        return regex.test(password);
    }

    const mainBtnEvent = async (event) => {
        event.preventDefault();
      
        if (isLogin) {
          const formData = {
            email,
            password,
          };
      
          try {
            const response = await axios.post('https://micro-service-2-instance-2p7cpjxoqq-ue.a.run.app/login', formData);
            console.log(formData);
      
            if (response.status === 200) {
              alert('Login Successful');
              navigate('/profile', {
                state: {
                  email: response.data.email,
                },
              });
            } else {
              setPasswordError(response.data.message);
            }
          } catch (error) {
            alert('Invalid Credentials');
            console.log('Error:', error);
          }
        } else {
          const formData = {
            email,
            location: 'Halifax',
            name: `${firstName} ${lastName}`,
            password,
          };
      
          try {
            const response = await axios.post('https://micro-service-1-instance-2p7cpjxoqq-ue.a.run.app/register', formData);
            console.log(formData);
      
            if (response.status === 200) {
              alert('Registration Successful, please login');
              navigate('/', {
                state: {
                  email: formData.email,
                },
              });
            } else {
              setPasswordError(response.data.message);
            }
          } catch (error) {
            alert('Invalid Credentials');
            console.log('Error:', error);
          }
        }
      };
      
      



    useEffect(() => {
        if (firstName.trim() !== '' && !validateFirstName(firstName)) {
            setFirstNameError('First name can only contain alphabets')
        } else {
            setFirstNameError('');
        }
    }, [firstName]);

    useEffect(() => {
        if (lastName.trim() !== '' && !validateFirstName(lastName)) {
            setLastNameError('Last name can only contain alphabets')
        } else {
            setLastNameError('');
        }
    }, [lastName])

    useEffect(() => {
        if (email.trim() !== '' && !validateEmail(email)) {
            setEmailError('Please enter a valid email')
        } else {
            setEmailError('');
        }
    }, [email])

    useEffect(() => {
        if (password.trim() !== '' && !validatePassword(password)) {
            setPasswordError('password should contain alpha-numeric and special characters')
        } else {
            setPasswordError('');
        }
    }, [password])

    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Password & confirm password do not match')
        }
        else {
            setConfirmPasswordError('');
        }
    }, [password, confirmPassword])
    useEffect(() => {
        setIsFormValid(email.trim() !== '' && password.trim() !== '' && !emailError && !passwordError);
    }, [email, password, emailError, passwordError]);
    return (
        <Box sx={{
            width: '300px',
            margin: 'auto',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',

        }}>
            <h3 style={{ marginBottom: '5px', marginTop: '5px' }}>{isLogin ? 'Login Form' : 'Registration Form'}</h3>
            <form onSubmit={mainBtnEvent}>
                {!isLogin && (
                    <Box sx={{ display: 'flex', gap: '10px', marginBottom: '2px' }}>
                        <TextField label="First Name" variant="outlined" fullWidth margin="normal" error={Boolean(firstNameError)} value={firstName}
                            onChange={(e) => { setFirstName(e.target.value) }}
                            helperText={firstNameError}
                            onBlur={() => { if (firstName.trim() === '') { setFirstNameError('First name cannot be empty'); } }}
                        />
                        <TextField label="Last Name" variant="outlined" fullWidth margin="normal"
                            value={lastName}
                            helperText={lastNameError} error={Boolean(lastNameError)}
                            onBlur={() => {
                                if (lastName.trim() === '') {
                                    setLastNameError('Last name cannot be empty');
                                }
                            }}
                            onChange={(e) => setLastName(e.target.value)} />
                    </Box>
                )}

                <TextField label="Email" variant="outlined" fullWidth margin="normal"
                    error={Boolean(emailError)}
                    value={email}
                    helperText={emailError}
                    placeholder='eg - jon_snow@westeros.com'
                    onBlur={() => {
                        if (email.trim() === '') {
                            setEmailError('Email cannot be empty');
                        }
                    }}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
                <TextField
                    error={Boolean(passwordError)}

                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    helperText={passwordError}
                    onBlur={() => {
                        if (password.trim() === '') {
                            setPasswordError('Password cannot be empty');
                        }
                        else if (password.length < 8) {
                            setPasswordError('Password should be greater than 8 characters')
                        }
                    }}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                {!isLogin && (
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={confirmPassword}
                        helperText={confirmPasswordError}
                        error={Boolean(confirmPasswordError)}
                        onBlur={() => {
                            if (confirmPassword.trim() === '') {
                                setConfirmPasswordError('Confirm password cannot be blank')
                            }
                        }}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                    />
                )}
                <Button style={{ marginTop: '17px', marginBottom: '7px' }} variant="contained" color="secondary" type="submit" disabled={!isFormValid} sx={{ fontWeight: 'bold' }}>
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </form>
        </Box>
    );
}

export default Form;

// Regular expression citation - used to create the regex used here for validation
// Reference: https://regexr.com/
// Form validation reference - to understand how validation is working
// Reference: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Form validation code reference - to understand how validation is implemented
// Reference: https://www.locofy.ai/blog/react-form-validation
// Prevent auto-reload of form when submitted reference
// Reference: https://www.robinwieruch.de/react-preventdefault/