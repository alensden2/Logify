import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Button from '@mui/material/Button';

function ProfilePage() {
  const location = useLocation();
  const email = location.state?.email || '';
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.post('https://micro-service-3-instance-2p7cpjxoqq-ue.a.run.app/home', {
          email: email,
        });
        setOnlineUsers(response.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchOnlineUsers();
  }, [email]);

  const handleLogout = async () => {
    try {
      await axios.post('https://micro-service-3-instance-2p7cpjxoqq-ue.a.run.app/logout', {
        email: email,
      });
      navigate('/');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <>
    <Navbar />
    <div style={{ padding: '20px' }}>
      
      <h1 style={{ textAlign: 'left' }}>Welcome to your profile</h1>
      <p style={{ textAlign: 'left' }}>Your email: {email}</p>

      <h2 style={{ textAlign: 'left' }}>The following users are online:</h2>
      <ul style={{ textAlign: 'left' }}>
        {onlineUsers.map((user) => (
          <li key={user.Email}>{user.Email}</li>
        ))}
      </ul>

      <Button variant="contained" color="primary" onClick={handleLogout} sx={{ marginTop: '20px' }}>
        Logout
      </Button>
    </div>
    </>
    
  );
}

export default ProfilePage;
