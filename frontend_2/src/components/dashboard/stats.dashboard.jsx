import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog, // For the video player modal
  DialogTitle,
  DialogContent,
  Alert, // Added Alert for error messages
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'; // Play icon for video cards
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
  const [selectedVideo, setSelectedVideo] = useState(null); // Controls the video player dialog

  // Memoize authHeaders to prevent unnecessary re-renders of fetchChannelStats
  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []); // Empty dependency array means it's created once

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

  // Use useCallback to memoize the fetch function
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
      setError(null); // Clear any previous errors

      // Fetch channel stats
      const statsResponse = await axios.get(
        `${API_URL}/api/version_1/dashboard/stats`,
        authHeaders
      );
      setChannelStats(statsResponse.data.data);

      // Fetch user's videos
      const videosResponse = await axios.get(
        `${API_URL}/api/version_1/video/my-videos`,
        authHeaders
      );
      setVideos(videosResponse.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]); // Dependency on authHeaders (which is stable due to useMemo)

  // useEffect to call the memoized fetch function on component mount
  useEffect(() => {
    fetchChannelStatsAndVideos();
  }, [fetchChannelStatsAndVideos]); // Depend on the memoized function

  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  // Framer Motion variants for animations
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
        mt: 8, // Adjust top margin as needed, considering your AppBar
        bgcolor: 'transparent',
        minHeight: 'calc(100vh - 100px)', // Adjust height based on your layout
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
            spacing={2} // Reduced spacing for a tighter look
            justifyContent="center"
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mb: 6 }}
          >
            {/* Adjusted Grid item sizes for smaller cards */}
            <Grid item xs={6} sm={4} md={2.5}> {/* Smaller column width */}
              <Card
                component={motion.div}
                variants={cardVariants}
                elevation={4}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 1.5, // Slightly less padding
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5, // Reduced gap
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <SubscriptionsIcon sx={{ fontSize: 35, color: 'info.main' }} /> {/* Smaller icon size */}
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {channelStats.totalSubscribers}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center"> {/* Smaller text for subtitle */}
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
                      overflow: 'hidden', // Ensures video/image corners are rounded
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
                    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
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
                          borderRadius: '12px 12px 0 0', // Top corners only
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
        open={!!selectedVideo} // Open if selectedVideo is not null
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
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 8,
          }
        }}
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="h5" component="h2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {selectedVideo.title}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseVideoPlayer}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ 
                width: '100%', 
                aspectRatio: '16/9', 
                bgcolor: 'black', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minWidth: { xs: '90vw', sm: '400px', md: '500px' }, // Set minimum width
                maxWidth: '750px', // Set maximum width
                minHeight: { xs: '200px', sm: '250px', md: '300px' }, // Set minimum height
                maxHeight: '450px', // Set maximum height
                mx: 'auto', // Center the video box horizontally
              }}>
                <video
                  controls
                  src={selectedVideo.videoFile}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    borderRadius: '0 0 16px 16px' 
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 'medium' }}>
                  Description:
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
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