import { useEffect, useState } from 'react';
import axios from 'axios';
import { handleWatch } from '../video/handleView.video.jsx';
import VideoLike from './video.like.jsx'; // Assuming VideoLike is correctly imported
import GetVideoComments from '../comment/getVideo.comment.jsx'; // Assuming GetVideoComments is in the parent directory of 'comment'
import ToggleSubscriptionButton from '../subscription/ToggleSubscriptionButton.jsx';

import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion, AnimatePresence } from 'framer-motion';



const API_URL = import.meta.env.VITE_BACKEND_URL;

const GetMyLikes = ({ currentUser }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]); // This will hold the raw video data
  const [errorMessage, setErrorMessage] = useState(''); // Renamed from errorMsg for consistency
  const [hoveredVideo, setHoveredVideo] = useState(null);


  const token = localStorage.getItem('accessToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };


  // Fetch liked videos from the backend
  const fetchLikedVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.get(
        `${API_URL}/api/version_1/likes/liked-videos`,
        authHeaders
      );

      const fetchedVideos = response.data?.data?.map((item) => item.likedVideo) || [];
      setLikedVideos(fetchedVideos); // Store the liked video objects
      setVideos(fetchedVideos); // Also update the general videos state for handleWatch
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch liked videos:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch liked videos. Please log in.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  // Handle watching a video
  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  // Close the video player
  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  // Handle video play and tracking views
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
          Loading liked videos...
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
        Your Liked Videos
      </Typography>

      {likedVideos.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', mt: 5, color: 'text.primary' }}
        >
          You haven't liked any videos yet.
        </Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {likedVideos.map((video) => (
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
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                      minHeight: '320px', // Adjusted for content without playlist
                      border: '1px solid rgba(255, 255, 255, 0.1)',
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
                              {formatDuration(video.duration)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <VisibilityIcon fontSize="inherit" sx={{ mr: 0.5 }} />
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
                              minHeight: '25px',
                              maxHeight: '48px',
                              fontWeight: 'medium',
                              mr: 1,
                            }}
                          >
                            {video.title}
                          </Typography>
                          {video.ownerDetails?._id &&
                            currentUser?._id !== video.ownerDetails._id && (
                              <Box sx={{ flexShrink: 0, ml: 'auto' }}>
                                <ToggleSubscriptionButton
                                  channelId={video.ownerDetails._id}
                                />
                              </Box>
                            )}
                            {video.ownerDetails?._id &&
                            currentUser?._id === video.ownerDetails._id && (
                               <Box sx={{ minHeight: '40px', minWidth: '80px', flexShrink: 0, ml: 'auto' }} />
                            )}
                        </Box>
                        <Box sx={{ minHeight: '20px' }}>
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
                                bgcolor: 'transparent',
                                color: 'text.secondary',
                                cursor: 'default',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      {/* No playlist section for liked videos */}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
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

export default GetMyLikes;