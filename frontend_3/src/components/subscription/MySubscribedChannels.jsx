import { useEffect, useState } from 'react';
import axios from 'axios';
import { handleWatch } from '../video/handleView.video.jsx';
import GetVideoComments from '../comment/getVideo.comment.jsx';
import VideoLike from '../like/video.like.jsx'; 

import {  Box,  Typography,  CircularProgress,  Grid,  Card,  CardMedia,  CardContent,  Modal,  Backdrop,  Fade,  IconButton,  Chip,  Avatar,  Button  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MySubscribedChannels = ({ currentUser, subscriberId }) => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [hoveredChannel, setHoveredChannel] = useState(null);


  const token = localStorage.getItem('accessToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        if (!subscriberId) {
          setError('No subscriber ID found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/version_1/subscriptions/user/${subscriberId}`,
          authHeaders
        );

        const fetchedChannels = response.data?.data || [];
        setSubscribedChannels(fetchedChannels);

        const allVideos = fetchedChannels
          .map((item) => item.subscribedChannel?.latestVideo)
          .filter(Boolean); 
        setVideos(allVideos); 

      } catch (err) {
        console.error('Fetch error:', err);
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to fetch channels.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [subscriberId, token]);

  const handleVideoPlay = (video) => {
    if (!video.videoFile) {
      setErrorMessage('Video URL not available.');
      return;
    }
    handleWatch(video, videos, setVideos, setErrorMessage, token);
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => setSelectedVideo(null);

  const handleCardMouseEnter = (video) => {
    setHoveredVideo(video);
  };

  const handleCardMouseLeave = () => {
    setHoveredVideo(null);
  };

  const handleChannelCardMouseEnter = (channel) => {
    setHoveredChannel(channel);
  };

  const handleChannelCardMouseLeave = () => {
    setHoveredChannel(null);
  };

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '0:00';
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          bgcolor: 'transparent',
          marginTop: '10vh',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Loading your subscribed channels...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 5 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'transparent',
        marginTop: '10vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}
      >
        My Subscribed Channels
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}
      >
        Showing latest videos from your subscribed channels
      </Typography>
      {subscribedChannels.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', mt: 5, color: 'text.primary' }}
        >
          You haven't subscribed to any channels yet.
        </Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {subscribedChannels.map((item) => {
              const subscribedChannel = item.subscribedChannel;

              if (!subscribedChannel) {
                console.warn(
                  "Skipping item due to missing 'subscribedChannel' property:",
                  item
                );
                return null;
              }

              const { _id, avatar, username, fullName, latestVideo } =
                subscribedChannel;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                    onMouseEnter={() => handleChannelCardMouseEnter(subscribedChannel)}
                    onMouseLeave={handleChannelCardMouseLeave}
                  >
                    <Card
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                        minHeight: '380px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 2,
                          pb: 1,
                        }}
                      >
                        <Avatar
                          alt={username}
                          src={avatar || 'https://via.placeholder.com/150'}
                          sx={{ width: 80, height: 80, mb: 2, border: '2px solid primary.main' }}
                        />
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}
                        >
                          {fullName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, textAlign: 'center' }}
                        >
                          @{username}
                        </Typography>
                      </CardContent>

                      {latestVideo ? (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1, textAlign: 'center', fontStyle: 'italic' }}
                          >
                            Latest Upload:
                          </Typography>
                          <Box
                            sx={{
                              position: 'relative',
                              height: 150,
                              width: '100%',
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              bgcolor: 'black',
                              cursor: 'pointer',
                              borderBottomLeftRadius: '12px',
                              borderBottomRightRadius: '12px',
                            }}
                            onClick={() => handleVideoPlay(latestVideo)}
                            onMouseEnter={() => handleCardMouseEnter(latestVideo)}
                            onMouseLeave={handleCardMouseLeave}
                          >
                            <CardMedia
                              component="img"
                              image={
                                latestVideo.thumbnail ||
                                'https://via.placeholder.com/200x112'
                              }
                              alt={latestVideo.title}
                              sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <AnimatePresence>
                              {hoveredVideo?._id === latestVideo._id && (
                                <motion.div
                                  variants={overlayVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
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
                                    <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                    {formatDuration(latestVideo.duration)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                  >
                                    <VisibilityIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                    {latestVideo.views || 0}
                                  </Typography>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 150,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            borderRadius: '0 0 12px 12px',
                            color: 'text.secondary',
                            p: 2,
                          }}
                        >
                          <Typography variant="body2" textAlign="center">
                            No videos published yet.
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      )}

      {/* Video Player Modal (similar to Homepage) */}
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
              width: { xs: '95%', sm: '90%', md: '85%' },
              maxWidth: '1000px',
              bgcolor: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '16px',
              border: '1px solid rgb(0,0,0)',
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
              p: { xs: 2, sm: 3, md: 4 },
              maxHeight: '90vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
                background: 'transparent',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 255, 255, 0.2)',
                borderRadius: '8px',
                '&:hover': {
                  background: 'rgba(0, 255, 255, 0.3)',
                },
              },
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 255, 255, 0.2) transparent',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                pb: 2,
              }}
            >
              <Typography
                id="video-player-modal-title"
                variant="h5"
                component="h2"
                sx={{
                  color: 'text.primary',
                  flexGrow: 1,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  fontWeight: 'bold'
                }}
              >
                {selectedVideo?.title}
              </Typography>
              <IconButton
                onClick={handleCloseVideoPlayer}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {selectedVideo?.videoFile && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  mb: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <video
                  controls
                  style={{
                    width: '100%',
                    display: 'block',
                    backgroundColor: '#000',
                  }}
                >
                  <source src={selectedVideo.videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            )}

            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                pb: 3,
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
                    bgcolor: 'transparent',
                    padding: '6px 12px',
                    color: 'text.primary',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
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

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Video Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {selectedVideo?.description}
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Comments
              </Typography>
              {selectedVideo?._id && (
                <Box sx={{ mt: 2 }}>
                  <GetVideoComments videoId={selectedVideo._id} />
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MySubscribedChannels;