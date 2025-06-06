import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { fetchAllVideos } from './video/fetchAll.video.jsx';
import { handleWatch } from './video/handleView.video.jsx';
import GetLike from './like/get.like.jsx';
import VideoLike from './like/video.like.jsx'; 
import GetVideoComments from './comment/getVideo.comment.jsx'; 
import ToggleSubscriptionButton from './subscription/ToggleSubscriptionButton.jsx';

import axios from 'axios';

import { Box, Typography, CircularProgress, Button, Grid, Card, CardMedia, CardContent, CardActions, Select, MenuItem, FormControl, InputLabel, Modal, Backdrop, Fade, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Homepage = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMessage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [addingVideoId, setAddingVideoId] = useState(null);
  const [selectedPlaylistForVideo, setSelectedPlaylistForVideo] = useState({});

  const token = localStorage.getItem('accessToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchVideos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const videoData = await fetchAllVideos(token);
      setVideos(videoData);
    } 
    catch (error) {
      setErrorMessage(error.message || 'Failed to load videos.');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    if (!currentUser?._id) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/version_1/playlist/user/${currentUser._id}`,
        authHeaders
      );
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/') {
      fetchVideos();
      fetchPlaylists();
    }
  }, [location.pathname, currentUser]);

  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  const handleVideoPlay = (video) => {
    handleWatch(video, videos, setVideos, setErrorMessage);
    handleWatchNow(video);
  };

  const handleMouseEnter = (video) => {
    setHoveredVideo(video);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  const onSelectPlaylist = (videoId, playlistId) => {
    setSelectedPlaylistForVideo((prev) => ({
      ...prev,
      [videoId]: playlistId,
    }));
  };

  const addVideoToPlaylist = async (videoId) => {
    const playlistId = selectedPlaylistForVideo[videoId];
    if (!playlistId) {
      alert('Please select a playlist first.');
      return;
    }
    setAddingVideoId(videoId);
    try {
      await axios.patch(
        `${API_URL}/api/version_1/playlist/add/${videoId}/${playlistId}`,
        {},
        authHeaders
      );
      alert('Video added to playlist!');
    } 
    catch (err) {
      alert(err.response?.data?.message || 'Failed to add video to playlist.');
    } 
    finally {
      setAddingVideoId(null);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10, color: 'text.primary' }}>
        <Typography variant="h4" gutterBottom>Welcome to our platform!</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>Please log in or register to view videos.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ mr: 2 }}>Login</Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/register')}>Register</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>Loading videos...</Typography>
        </Box>
      ) : errorMsg ? (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 5 }}>{errorMsg}</Typography>
      ) : videos.length > 0 ? (
        <>
          {/* Featured Videos Section (First 5 videos) */}
          <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>Featured Videos</Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {videos.slice(0, 5).map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={video._id}>
                <motion.div
                  onMouseEnter={() => handleMouseEnter(video)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleVideoPlay(video)}
                  whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.5)' }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'relative', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
                >
                  {hoveredVideo?._id === video._id && hoveredVideo.videoFile ? (
                    <motion.video
                      src={hoveredVideo.videoFile}
                      autoPlay
                      loop
                      muted
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      image={video.thumbnail}
                      alt={`${video.title} Thumbnail`}
                      sx={{ height: 180, borderRadius: '12px', zIndex: 2, position: 'relative' }}
                    />
                  )}
                  <Box sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', px: 1, py: 0.5, borderRadius: '4px', zIndex: 3 }}>
                    <Typography variant="caption">{video.duration.toFixed(2)} sec</Typography>
                  </Box>
                  <CardContent sx={{ position: 'relative', zIndex: 3, p: 1 }}>
                    <Typography variant="subtitle1" component="h3" sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {video.title}
                    </Typography>
                  </CardContent>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* All Videos Section */}
          <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>All Videos</Typography>
          <Grid container spacing={4}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: '0px 8px 16px rgba(0,0,0,0.4)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Card sx={{ maxWidth: 345, bgcolor: 'background.paper', borderRadius: '12px' }}>
                    <CardMedia
                      component="img"
                      height="190"
                      image={video.thumbnail}
                      alt={`${video.title} Thumbnail`}
                      onClick={() => handleVideoPlay(video)}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', px: 1, py: 0.5, borderRadius: '4px' }}>
                      <Typography variant="caption">{video.duration.toFixed(2)} sec</Typography>
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {video.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                        <Typography variant="body2">{video.views} views</Typography>
                        <Typography variant="body2" sx={{ mx: 1 }}>•</Typography>
                        <GetLike videoId={video._id} accessToken={token} />
                      </Box>
                      {video.ownerDetails?._id && currentUser._id !== video.ownerDetails._id && (
                        <ToggleSubscriptionButton channelId={video.ownerDetails._id} />
                      )}

                      {/* Add to Playlist */}
                      <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                          <InputLabel id={`playlist-select-label-${video._id}`}>Add to Playlist</InputLabel>
                          <Select
                            labelId={`playlist-select-label-${video._id}`}
                            value={selectedPlaylistForVideo[video._id] || ''}
                            label="Add to Playlist"
                            onChange={(e) => onSelectPlaylist(video._id, e.target.value)}
                            sx={{ color: 'text.primary' }}
                          >
                            <MenuItem value=""><em>Select a playlist</em></MenuItem>
                            {playlists.map((playlist) => (
                              <MenuItem key={playlist._id} value={playlist._id}>
                                {playlist.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => addVideoToPlaylist(video._id)}
                          disabled={addingVideoId === video._id || !selectedPlaylistForVideo[video._id]}
                          fullWidth
                        >
                          {addingVideoId === video._id ? 'Adding...' : 'Add to Playlist'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, color: 'text.primary' }}>No videos available.</Typography>
      )}

      {/* Video Player Modal */}
      <Modal
        aria-labelledby="video-player-modal-title"
        aria-describedby="video-player-modal-description"
        open={!!selectedVideo}
        onClose={handleCloseVideoPlayer}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={!!selectedVideo}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '900px',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="video-player-modal-title" variant="h5" component="h2" sx={{ color: 'text.primary' }}>
                {selectedVideo?.title}
              </Typography>
              <IconButton onClick={handleCloseVideoPlayer} color="inherit">
                <CloseIcon sx={{ color: 'text.primary' }} />
              </IconButton>
            </Box>
            {selectedVideo?.videoFile && (
              <video controls style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}>
                <source src={selectedVideo.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <Box sx={{ mb: 2 }}>
              <VideoLike videoId={selectedVideo?._id} accessToken={token} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}><u>Video Description :</u></Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3, color: 'text.primary' }}>{selectedVideo?.description}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}><u>Comments :</u></Typography>
            {selectedVideo?._id && <GetVideoComments videoId={selectedVideo._id} />}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Homepage;