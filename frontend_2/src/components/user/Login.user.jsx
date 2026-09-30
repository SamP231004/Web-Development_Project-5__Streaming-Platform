import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Link, InputAdornment, IconButton, Divider } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import api, { getErrorMessage, saveSession } from '../../api.js';

const DEMO_ACCOUNT = { email: 'one@one.com', password: 'password' };

export const AuthCard = ({ title, subtitle, children, maxWidth = 420 }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4 }}>
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth,
        bgcolor: 'rgba(10, 10, 10, 0.8)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
      }}
    >
      <Typography variant="h4" component="h1" align="center" sx={{ fontSize: '2rem' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" align="center" sx={{ mt: 1, mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Paper>
  </Box>
);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', credentials);
      saveSession(data.data);
      onLogin(data.data.user);
      navigate(location.state?.from || '/', { replace: true });
    }
    catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please check your credentials.'));
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    login(DEMO_ACCOUNT);
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue watching">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.25 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
        </Button>
      </form>

      <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.8rem' }}>or</Divider>

      <Button variant="outlined" color="secondary" fullWidth onClick={handleDemo} disabled={loading} sx={{ py: 1.1 }}>
        Try the demo account
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don&apos;t have an account?{' '}
        <Link component="button" type="button" onClick={() => navigate('/register')} sx={{ verticalAlign: 'baseline' }}>
          Register
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default Login;
