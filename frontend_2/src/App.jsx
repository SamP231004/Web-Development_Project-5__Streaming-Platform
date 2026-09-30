import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import api, { clearSession, getStoredUser } from './api.js';
import { NotifyProvider } from './components/common/Notify.jsx';
import Layout from './components/Layout';
import LandingPage from './LandingPage.jsx';
import Homepage from './components/Homepage';
import GetMyLikes from './components/like/getMy.like';
import PublishVideo from './components/video/publish.video';
import Dashboard from './components/dashboard/stats.dashboard';
import Login from './components/user/Login.user';
import Register from './components/user/Register.user';
import MySubscribedChannels from './components/subscription/MySubscribedChannels';
import PlaylistPage from './components/playlist/PlaylistPage';
import PaymentSuccess, { PaymentCancel } from './components/payment/PaymentSuccess';

import theme from './theme.js';

const App = () => {
  // Start from the stored user so a refresh doesn't flash the logged-out UI;
  // it is re-validated against the server below.
  const [currentUser, setCurrentUser] = useState(() =>
    localStorage.getItem('accessToken') ? getStoredUser() : null
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback((user) => setCurrentUser(user), []);

  const handleLogout = useCallback(() => {
    // Best effort: clear the server-side refresh token too. The token is read
    // up front because the session is cleared before the request goes out.
    const token = localStorage.getItem('accessToken');
    api.post('/users/logout', null, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    clearSession();
    setCurrentUser(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      clearSession();
      setCurrentUser(null);
      return;
    }

    api.get('/users/current-user')
      .then(({ data }) => {
        setCurrentUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        // Only sign out when the server rejected the session, not when it was unreachable.
        if (error.response) {
          clearSession();
          setCurrentUser(null);
        }
      });
  }, []);

  // The API client fires this when a token refresh fails.
  useEffect(() => {
    const onForcedLogout = () => setCurrentUser(null);
    window.addEventListener('auth:logout', onForcedLogout);
    return () => window.removeEventListener('auth:logout', onForcedLogout);
  }, []);

  const page = (element) => (
    <Layout currentUser={currentUser} onLogout={handleLogout}>{element}</Layout>
  );

  const protectedPage = (element) =>
    currentUser ? page(element) : <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const guestOnly = (element) => (currentUser ? <Navigate to="/" replace /> : element);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotifyProvider>
        <Routes>
          <Route
            path="/"
            element={currentUser ? page(<Homepage currentUser={currentUser} />) : (
              <Layout currentUser={null} onLogout={handleLogout} fullBleed>
                <LandingPage onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
              </Layout>
            )}
          />
          <Route path="/likes/liked-videos" element={protectedPage(<GetMyLikes currentUser={currentUser} />)} />
          <Route path="/publish-video" element={protectedPage(<PublishVideo />)} />
          <Route path="/dashboard/stats" element={protectedPage(<Dashboard currentUser={currentUser} />)} />
          <Route path="/subscriptions/my-channels" element={protectedPage(<MySubscribedChannels currentUser={currentUser} />)} />
          <Route path="/playlist" element={protectedPage(<PlaylistPage currentUser={currentUser} />)} />
          <Route path="/video/my-videos" element={<Navigate to="/dashboard/stats" replace />} />
          <Route path="/login" element={guestOnly(<Login onLogin={handleLogin} />)} />
          <Route path="/register" element={guestOnly(<Register onLogin={handleLogin} />)} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotifyProvider>
    </ThemeProvider>
  );
};

export default App;
