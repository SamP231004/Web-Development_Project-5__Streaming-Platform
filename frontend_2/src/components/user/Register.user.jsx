import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Link, InputLabel, FormControl } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);

    if (avatar) formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const response = await axios.post(`${API_URL}/api/version_1/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Registration Success:', response.data.message);
        console.log('User Details:', user);
        setSuccess('Registration successful! Redirecting to homepage...');
        window.location.href = '/';
      }
    }

    catch (err) {
      console.error('Registration Failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'transparent',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            overflow: 'scroll',
            borderRadius: '12px',
            maxWidth: '500px',
            maxHeight: '90vh',
            boxShadow: '0 0 25px rgba(0, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            width: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            '&::-webkit-scrollbar': {
              width: '0px',
              height: '0px',
            },
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, color: 'text.primary' }}
          >
            Register
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              variant="outlined"
              sx={{ input: { color: 'text.primary' }, label: { color: 'text.secondary' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'text.secondary' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              sx={{ input: { color: 'text.primary' }, label: { color: 'text.secondary' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'text.secondary' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }}
            />
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
              sx={{ input: { color: 'text.primary' }, label: { color: 'text.secondary' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'text.secondary' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{ input: { color: 'text.primary' }, label: { color: 'text.secondary' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'text.secondary' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }}
            />

            {/* Avatar Upload */}
            <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
              <InputLabel shrink htmlFor="avatar-upload-button" sx={{ color: 'text.secondary', '&.Mui-focused': { color: 'primary.main' } }}>
                Upload Avatar
              </InputLabel>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  color: 'white',
                  py: 1.5,
                  mt: 3
                }}
              >
                {avatar ? avatar.name : 'Choose Avatar Image'}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  required
                />
              </Button>
            </FormControl>

            {/* Cover Image Upload */}
            <FormControl fullWidth margin="normal" sx={{ mt: 2, mb: 3 }}>
              <InputLabel shrink htmlFor="cover-image-upload-button" sx={{ color: 'text.secondary', '&.Mui-focused': { color: 'primary.main' } }}>
                Upload Cover Image (optional)
              </InputLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderColor: 'text.secondary',
                  color: 'text.primary',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(255,0,0,0.05)' },
                  py: 1.5,
                  mt: 3
                }}
              >
                {coverImage ? coverImage.name : 'Choose Cover Image'}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </Button>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link component="button" onClick={() => navigate('/login')} sx={{ color: 'primary.light' }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;