import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios'; 

import Layout from './components/Layout';
import Homepage from './components/Homepage';
import MyVideos from './components/video/getMy.video';
import GetMyLikes from './components/like/getMy.like'; 
import PublishVideo from './components/video/publish.video'; 
import Dashboard from './components/dashboard/stats.dashboard'; 
import Login from './components/user/Login.user'; 
import Register from './components/user/Register.user';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get('https://streamingplatformbackend.onrender.com/api/version_1/users/current-user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('accessToken');
          setCurrentUser(null);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Layout currentUser={currentUser} onLogout={handleLogout}><Homepage currentUser={currentUser} /></Layout>} />
      <Route path="/video/my-videos" element={<Layout currentUser={currentUser} onLogout={handleLogout}><MyVideos /></Layout>} />
      <Route path="/likes/liked-videos" element={<Layout currentUser={currentUser} onLogout={handleLogout}><GetMyLikes /></Layout>} />
      <Route path="/publish-video" element={<Layout currentUser={currentUser} onLogout={handleLogout}><PublishVideo /></Layout>} />
      <Route path="/dashboard/stats" element={<Layout currentUser={currentUser} onLogout={handleLogout}><Dashboard /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
