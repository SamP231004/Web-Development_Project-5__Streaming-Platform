import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress, Alert, Link, Avatar, Grid } from '@mui/material';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined';
import { styled } from '@mui/material/styles';
import api, { getErrorMessage, saveSession } from '../../api.js';
import { AuthCard } from './Login.user.jsx';
import { useObjectUrl } from '../../utils/useObjectUrl.js';

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

const Register = ({ onLogin }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const avatarPreview = useObjectUrl(avatar);
  const coverPreview = useObjectUrl(coverImage);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // The file input is visually hidden, so the browser can't show its own "required" message.
    if (!avatar) {
      setError('Please choose an avatar image.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value.trim()));
    formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    setLoading(true);
    try {
      const { data } = await api.post('/users/register', formData);
      saveSession(data.data);
      onLogin(data.data.user);
      navigate('/', { replace: true });
    }
    catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Join and start sharing your videos" maxWidth={520}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleRegister}>
        {/* Cover image with avatar overlapping it, like a channel header */}
        <Box sx={{ position: 'relative', mb: 6 }}>
          <Box
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              height: 110,
              borderRadius: 3,
              border: coverPreview ? 'none' : '2px dashed rgba(255,255,255,0.2)',
              backgroundImage: coverPreview ? `url(${coverPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { borderColor: 'secondary.main', color: 'text.primary' },
            }}
          >
            {!coverPreview && (
              <>
                <WallpaperOutlinedIcon />
                <Typography variant="body2">Cover image (optional)</Typography>
              </>
            )}
            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0] || null)} />
          </Box>
          <Box
            component="label"
            title="Choose avatar"
            sx={{ position: 'absolute', left: 16, bottom: -40, cursor: 'pointer', borderRadius: '50%' }}
          >
            <Avatar
              src={avatarPreview || undefined}
              sx={{
                width: 84,
                height: 84,
                bgcolor: '#1F1F1F',
                border: '3px solid',
                borderColor: avatar ? 'primary.main' : 'rgba(255,255,255,0.3)',
                color: 'text.secondary',
              }}
            >
              <AddAPhotoOutlinedIcon />
            </Avatar>
            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0] || null)} />
          </Box>
          <Typography variant="caption" sx={{ position: 'absolute', left: 112, bottom: -28 }}>
            {avatar ? 'Avatar selected' : 'Avatar (required)'}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Full name" name="fullName" autoComplete="name" fullWidth value={form.fullName} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Username" name="username" autoComplete="username" fullWidth value={form.username} onChange={handleChange} required />
          </Grid>
          <Grid size={12}>
            <TextField label="Email" name="email" type="email" autoComplete="email" fullWidth value={form.email} onChange={handleChange} required />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              fullWidth
              value={form.password}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.25 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account?{' '}
        <Link component="button" type="button" onClick={() => navigate('/login')} sx={{ verticalAlign: 'baseline' }}>
          Log in
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default Register;
