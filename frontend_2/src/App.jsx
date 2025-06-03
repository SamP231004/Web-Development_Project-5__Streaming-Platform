import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import your components
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import MyVideos from './components/video/getMy.video';
import GetMyLikes from './components/like/getMy.like';
import PublishVideo from './components/video/publish.video';
import Dashboard from './components/dashboard/stats.dashboard';
import Login from './components/user/Login.user';
import Register from './components/user/Register.user';
import MySubscribedChannels from './components/subscription/MySubscribedChannels'
import PlaylistPage from './components/playlist/PlaylistPage';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token from localStorage:', token);
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/version_1/users/current-user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('API response for current user:', response.data);
          const user = response.data.data;
          setCurrentUser(user);
          console.log("Current user set in state:", user);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else {
        console.log('No token found, user not logged in.');
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
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
      <Route
        path="/subscriptions/my-channels"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            {currentUser && currentUser._id ? (
              <MySubscribedChannels subscriberId={currentUser._id} />
            ) : (
              <p>Please log in to view your subscriptions.</p>
            )}
          </Layout>
        }
      />
      <Route
        path="/playlist"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <PlaylistPage />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;