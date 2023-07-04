import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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
      // Perform additional logout logic here, such as clearing session/local storage, etc.
      navigate('/');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to your profile</h1>
      <p>Your email: {email}</p>

      <h2>The following users are online:</h2>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.Email}>{user.Email}</li>
        ))}
      </ul>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ProfilePage;
