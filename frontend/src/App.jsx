import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

// Import your components
import Layout from './components/Layout'; // Adjust the path as needed
import Homepage from './components/Homepage'; // Adjust the path as needed
import MyVideos from './components/video/getMy.video'; // Adjust the path as needed
import GetMyLikes from './components/like/getMy.like'; // Adjust the path as needed
import PublishVideo from './components/video/publish.video'; // Adjust the path as needed
import Dashboard from './components/dashboard/stats.dashboard'; // Adjust the path as needed
import Login from './components/user/Login.user'; // Adjust the path as needed
import Register from './components/user/Register.user'; // Adjust the path as needed

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // Move this inside the App component

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/version_1/users/current-user', {
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
