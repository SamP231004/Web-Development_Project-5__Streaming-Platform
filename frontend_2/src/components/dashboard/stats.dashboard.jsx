import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Chip, IconButton, Dialog,  DialogTitle, DialogContent, Alert } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [channelStats, setChannelStats] = useState({
    totalSubscribers: 0,
    totalLikes: 0,
    totalViews: 0,
    totalVideos: 0,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null); 

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []); 

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchChannelStatsAndVideos = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found.");
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statsResponse = await axios.get(
        `${API_URL}/api/version_1/dashboard/stats`,
        authHeaders
      );
      setChannelStats(statsResponse.data.data);

      const videosResponse = await axios.get(
        `${API_URL}/api/version_1/video/my-videos`,
        authHeaders
      );
      setVideos(videosResponse.data.data);
    } 
    catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } 
    finally {
      setLoading(false);
    }
  }, [authHeaders]); 

  useEffect(() => {
    fetchChannelStatsAndVideos();
  }, [fetchChannelStatsAndVideos]);

  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        mt: 8,
        bgcolor: 'transparent',
        minHeight: 'calc(100vh - 100px)',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ color: 'text.primary', fontWeight: 'bold', mb: 4 }}
      >
        Your Channel Dashboard
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={50} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>Loading your channel data...</Typography>
        </Box>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
          <Typography variant="h6">Oops! Something went wrong.</Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      {/* Content when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Channel Statistics */}
          <Typography variant="h5" component="h2" sx={{ color: 'text.primary', fontWeight: 'medium', mb: 2, textAlign: 'center' }}>
            Channel Overview
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mb: 6 }}
          >
            {/* Adjusted Grid item sizes for smaller cards */}
            <Grid item xs={6} sm={4} md={2.5}>
              <Card
                component={motion.div}
                variants={cardVariants}
                elevation={4}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 1.5, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5, 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <SubscriptionsIcon sx={{ fontSize: 35, color: 'info.main' }} /> 
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {channelStats.totalSubscribers}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  Subscribers
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.5}>
              <Card
                component={motion.div}
                variants={cardVariants}
                elevation={4}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <ThumbUpIcon sx={{ fontSize: 35, color: 'success.main' }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {channelStats.totalLikes}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  Total Likes
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.5}>
              <Card
                component={motion.div}
                variants={cardVariants}
                elevation={4}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <VisibilityIcon sx={{ fontSize: 35, color: 'warning.main' }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {channelStats.totalViews}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  Total Views
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.5}>
              <Card
                component={motion.div}
                variants={cardVariants}
                elevation={4}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <VideoLibraryIcon sx={{ fontSize: 35, color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {channelStats.totalVideos}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  Total Videos
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* My Videos Section */}
          <Typography variant="h5" component="h2" sx={{ color: 'text.primary', fontWeight: 'medium', mb: 2, textAlign: 'center' }}>
            My Uploaded Videos
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {videos.length > 0 ? (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video._id}>
                  <Card
                    component={motion.div}
                    variants={cardVariants}
                    elevation={4}
                    sx={{
                      bgcolor: 'rgba(0,0,0, 0.4)',
                      borderRadius: '12px',
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 8,
                      },
                      border: '1px solid rgb(255, 255, 255)',
                    }}
                    onClick={() => handleWatchNow(video)}
                  >
                    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px 12px 0 0', 
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                          fontSize: '4rem',
                        }}
                        aria-label="play video"
                      >
                        <PlayCircleFilledWhiteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ color: 'text.primary', mb: 1, fontWeight: 'bold' }}>
                        {video.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Chip
                          label={`Views: ${video.views}`}
                          size="small"
                          icon={<VisibilityIcon fontSize="small" />}
                          sx={{ bgcolor: 'info.dark', color: 'info.contrastText' }}
                        />
                        <Chip
                          label={`Duration: ${video.duration?.toFixed(1) || 'N/A'}s`}
                          size="small"
                          sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Uploaded: {formatDate(video.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 3, fontStyle: 'italic' }}>
                  You haven't uploaded any videos yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* Video Player Dialog (Modal) */}
      <Dialog
        open={!!selectedVideo}
        onClose={handleCloseVideoPlayer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: '16px',
            bgcolor: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
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
          }
        }}
      >
        {selectedVideo && (
          <>
            <DialogTitle
              sx={{
                m: 0,
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: 'rgba(0, 0, 0, 0.4)'
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}
              >
                {selectedVideo.title}
              </Typography>
              <IconButton
                aria-label="close"
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
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: 'rgba(0, 0, 0, 0.4)' }}>
              <Box sx={{
                width: '100%',
                position: 'relative',
                aspectRatio: '16/9',
                bgcolor: 'black',
                overflow: 'hidden',
                borderRadius: '8px',
                mb: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                mx: 'auto',
                maxWidth: '900px'
              }}>
                <video
                  controls
                  src={selectedVideo.videoFile}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </Box>

              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
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
                    color: 'text.primary',
                    whiteSpace: 'pre-wrap',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {selectedVideo.description}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard;