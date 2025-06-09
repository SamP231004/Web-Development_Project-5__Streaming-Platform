import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { fetchAllVideos } from './video/fetchAll.video.jsx';
import { handleWatch } from './video/handleView.video.jsx';
import GetLike from './like/get.like.jsx';
import VideoLike from './like/video.like.jsx';
import GetVideoComments from './comment/getVideo.comment.jsx';
import ToggleSubscriptionButton from './subscription/ToggleSubscriptionButton.jsx';

import axios from 'axios';

import { Box, Typography, CircularProgress, Button, Grid, Card, CardMedia, CardContent, Select, MenuItem, FormControl, InputLabel, Modal, Backdrop, Fade, IconButton, Chip, Avatar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { motion, AnimatePresence } from 'framer-motion';

import LandingPage from '../LandingPage.jsx';

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
    } 
    catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/') {
      fetchVideos();
      if (currentUser) {
        fetchPlaylists();
      }
    }
  }, [location.pathname, currentUser]);

  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  const handleVideoPlay = (video) => {
    if (currentUser && token) {
      handleWatch(video, videos, setVideos, setErrorMessage, token);
    }
    handleWatchNow(video);
  };

  const handleCardMouseEnter = (video) => {
    setHoveredVideo(video);
  };

  const handleCardMouseLeave = () => {
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
      console.error('Failed to add video to playlist:', err);
      alert(err.response?.data?.message || 'Failed to add video to playlist.');
    } 
    finally {
      setAddingVideoId(null);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const featuredItemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      scale: 1.08,
      boxShadow: '0px 15px 30px rgba(0,0,0,0.6)',
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  if (!currentUser) {
    return <LandingPage onGetStarted={() => navigate('/login')} />;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Loading videos...
          </Typography>
        </Box>
      ) : errorMsg ? (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 5 }}>
          {errorMsg}
        </Typography>
      ) : videos.length > 0 ? (
        <>
          {/* Featured Videos Section (First 5 videos) */}
          <Typography
            variant="h5"
            sx={{ mb: 3, color: 'text.primary', fontWeight: 'bold' }}
          >
            Featured Videos
          </Typography>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {videos.slice(0, 6).map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                  <motion.div
                    variants={featuredItemVariants}
                    whileHover="hover"
                    onMouseEnter={() => handleCardMouseEnter(video)}
                    onMouseLeave={handleCardMouseLeave}
                    onClick={() => handleVideoPlay(video)}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      height: '100%',
                      transformOrigin: 'center',
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          height: 350,
                          width: '100%',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: 'black',
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {hoveredVideo?._id === video._id &&
                          hoveredVideo.videoFile ? (
                            <motion.video
                              key="video-preview"
                              src={hoveredVideo.videoFile}
                              autoPlay
                              loop
                              muted
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 1,
                              }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <motion.div
                              key="thumbnail-with-overlay"
                              initial="visible"
                              animate="visible"
                              exit="exit"
                              variants={overlayVariants}
                              style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={video.thumbnail}
                                alt={`${video.title} Thumbnail`}
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                  objectFit: 'cover',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  zIndex: 0,
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>

                      <CardContent
                        sx={{
                          position: 'relative',
                          zIndex: 3,
                          p: 1.5,
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          height: '0%',
                        }}
                      >
                        {/* Content for featured video cards goes here if needed */}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Separator line */}
          <hr
            style={{
              border: 'none',
              borderTop: '1px dashed #666',
              margin: '40px 0',
            }}
          />

          {/* All Videos Section */}
          <Typography
            variant="h5"
            sx={{ mb: 3, mt: 4, color: 'text.primary', fontWeight: 'bold' }}
          >
            All Videos
          </Typography>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                    onMouseEnter={() => handleCardMouseEnter(video)}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                        minHeight: '400px',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          height: 190,
                          width: '100%',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: 'black',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={video.thumbnail}
                          alt={`${video.title} Thumbnail`}
                          onClick={() => handleVideoPlay(video)}
                          sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderBottomLeftRadius: '0px',
                            borderBottomRightRadius: '0px',
                          }}
                        />
                        {/* Duration, Views, and Likes overlay - only display on hover */}
                        <AnimatePresence>
                          {hoveredVideo?._id === video._id && (
                            <motion.div
                              variants={overlayVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              style={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                zIndex: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <AccessTimeIcon
                                  fontSize="inherit"
                                  sx={{ mr: 0.5 }}
                                />
                                {formatDuration(video.duration)}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <VisibilityIcon
                                  fontSize="inherit"
                                  sx={{ mr: 0.5 }}
                                />
                                {video.views}
                              </Typography>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          pb: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          {' '}
                          {/* Use flexGrow to push button/playlist to bottom */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              sx={{
                                color: 'text.primary',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '48px',
                                maxHeight: '48px',
                                fontWeight: 'medium',
                                mr: 1,
                              }}
                            >
                              {video.title}
                            </Typography>
                            {/* Subscription Button beside title */}
                            {video.ownerDetails?._id &&
                            currentUser._id !== video.ownerDetails._id ? (
                              <Box sx={{ flexShrink: 0, ml: 'auto' }}>
                                {' '}
                                {/* Removed minWidth as it's now handled by the button itself */}
                                <ToggleSubscriptionButton
                                  channelId={video.ownerDetails._id}
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  minHeight: '40px',
                                  minWidth: '80px',
                                  flexShrink: 0,
                                  ml: 'auto',
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ minHeight: '20px' }}>
                            {' '}
                            {/* Consistent height for channel chip area */}
                            {video.ownerDetails && (
                              <Chip
                                avatar={
                                  <Avatar
                                    alt={video.ownerDetails.username}
                                    src={video.ownerDetails.avatar}
                                  />
                                }
                                label={video.ownerDetails.username}
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  bgcolor: 'secondary.light',
                                  color: 'text.secondary',
                                  cursor: 'default',
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        {/* Add to Playlist */}
                        {playlists.length > 0 && (
                          <Box sx={{ mt: 2, minHeight: '80px' }}>
                            {' '}
                            {/* Adjusted minHeight to account for select and button */}
                            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                              <InputLabel
                                id={`playlist-select-label-${video._id}`}
                                sx={{ color: 'text.secondary' }}
                              >
                                Add to Playlist
                              </InputLabel>
                              <Select
                                labelId={`playlist-select-label-${video._id}`}
                                value={selectedPlaylistForVideo[video._id] || ''}
                                label="Add to Playlist"
                                onChange={(e) =>
                                  onSelectPlaylist(video._id, e.target.value)
                                }
                                sx={{
                                  color: 'text.primary',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'text.secondary',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                  },
                                }}
                              >
                                <MenuItem value="">
                                  <em>Select a playlist</em>
                                </MenuItem>
                                {playlists.map((playlist) => (
                                  <MenuItem
                                    key={playlist._id}
                                    value={playlist._id}
                                    sx={{ color: 'text.primary' }}
                                  >
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
                              disabled={
                                addingVideoId === video._id ||
                                !selectedPlaylistForVideo[video._id]
                              }
                              fullWidth
                              sx={{ py: 1 }}
                            >
                              {addingVideoId === video._id ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                'Add to Playlist'
                              )}
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', mt: 5, color: 'text.primary' }}
        >
          No videos available.
        </Typography>
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', md: '90%' },
              maxWidth: '900px',
              bgcolor: 'background.paper',
              borderRadius: '12px',
              boxShadow: 24,
              p: { xs: 2, md: 4 },
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                id="video-player-modal-title"
                variant="h5"
                component="h2"
                sx={{ color: 'text.primary', flexGrow: 1 }}
              >
                {selectedVideo?.title}
              </Typography>
              <IconButton onClick={handleCloseVideoPlayer} color="inherit">
                <CloseIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Box>
            {selectedVideo?.videoFile && (
              <video
                controls
                style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
              >
                <source src={selectedVideo.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <VideoLike videoId={selectedVideo?._id} accessToken={token} />
              {selectedVideo?.ownerDetails && (
                <Chip
                  avatar={
                    <Avatar
                      alt={selectedVideo.ownerDetails.username}
                      src={selectedVideo.ownerDetails.avatar}
                    />
                  }
                  label={selectedVideo.ownerDetails.username}
                  variant="outlined"
                  sx={{
                    cursor: 'default',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                  }}
                />
              )}
              {selectedVideo?.ownerDetails?._id &&
              currentUser._id !== selectedVideo.ownerDetails._id && (
                <ToggleSubscriptionButton
                  channelId={selectedVideo.ownerDetails._id}
                />
              )}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', mb: 1, fontWeight: 'bold' }}
            >
              Video Description :
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', mb: 3, color: 'text.primary' }}
            >
              {selectedVideo?.description}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', mb: 1, fontWeight: 'bold' }}
            >
              Comments :
            </Typography>
            {selectedVideo?._id && <GetVideoComments videoId={selectedVideo._id} />}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Homepage;