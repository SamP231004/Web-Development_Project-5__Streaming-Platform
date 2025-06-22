import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Chip, Avatar, IconButton } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListIcon from '@mui/icons-material/List';
import { motion, AnimatePresence } from "framer-motion";

import PlaylistForm from "./PlaylistForm";
import PlaylistList from "./PlaylistList";
import PlaylistDetails from "./PlaylistDetails";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPlaylists = useCallback(async () => {
    if (!token || !user?._id) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      setIsInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/version_1/playlist/user/${user._id}`,
        authHeaders
      );
      setPlaylists(response.data?.data || []);
    } 
    catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load playlists."
      );
    } 
    finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [token, user?._id, authHeaders]);

  useEffect(() => {
    let mounted = true;

    const loadPlaylists = async () => {
      await fetchPlaylists();
      if (!mounted) return;
    };

    loadPlaylists();

    return () => {
      mounted = false;
    };
  }, [fetchPlaylists]);

  const handleCreatePlaylist = async (data) => {
    if (!token || !user?._id) {
      setError("User not authenticated.");
      return;
    }

    const optimisticPlaylist = {
      ...data,
      _id: Date.now().toString(),
      userId: user._id,
      videos: [],
      isOptimistic: true
    };

    setPlaylists(prev => [...prev, optimisticPlaylist]);
    setShowPlaylistForm(false);

    try {
      const payload = { ...data, userId: user._id };
      const response = await axios.post(
        `${API_URL}/api/version_1/playlist`, 
        payload, 
        authHeaders
      );
      setPlaylists(prev => prev.map(p => 
        p.isOptimistic ? response.data.data : p
      ));
    } 
    catch (err) {
      setPlaylists(prev => prev.filter(p => !p.isOptimistic));
      setError(
        err.response?.data?.message || err.message || "Failed to create playlist."
      );
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!selectedPlaylist) {
      setError("No playlist selected to remove video from.");
      return;
    }

    const originalPlaylist = { ...selectedPlaylist };
    
    // Optimistic update
    setSelectedPlaylist(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v._id !== videoId)
    }));

    try {
      await axios.patch(
        `${API_URL}/api/version_1/playlist/remove/${videoId}/${selectedPlaylist._id}`,
        {},
        authHeaders
      );
      await fetchPlaylists();
    } 
    catch (err) {
      setSelectedPlaylist(originalPlaylist);
      setError(
        err.response?.data?.message || err.message || "Failed to remove video."
      );
    }
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist((prevSelectedPlaylist) =>
      prevSelectedPlaylist && prevSelectedPlaylist._id === playlist._id
        ? null
        : playlist
    );
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

  if (isInitialLoad) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 100px)',
          bgcolor: 'transparent',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Loading your playlists...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'transparent',
        marginTop: '10vh',
        minHeight: 'calc(100vh - 100px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: 'text.primary', fontWeight: 'bold' }}
        >
          Your Playlists
        </Typography>
        <Box>
          <Chip
            label="Create New Playlist"
            icon={<AddCircleOutlineIcon />}
            onClick={() => setShowPlaylistForm(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              mr: 1,
              mb: { xs: 1, sm: 0 },
            }}
          />
          <Chip
            label="View Playlists"
            icon={<ListIcon />}
            onClick={() => setShowPlaylistForm(false)}
            sx={{
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
              mb: { xs: 1, sm: 0 },
            }}
          />
        </Box>
      </Box>

      {error && (
        <Typography 
          variant="h6" 
          color="error" 
          sx={{ 
            textAlign: 'center', 
            mb: 3,
            p: 2,
            bgcolor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: 1
          }}
        >
          {error}
        </Typography>
      )}

      {loading && !isInitialLoad && playlists.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={30} sx={{ color: 'primary.main' }} />
        </Box>
      )}

      <AnimatePresence mode="wait">
        {showPlaylistForm && (
          <motion.div
            key="playlistForm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PlaylistForm onSubmit={handleCreatePlaylist} loading={loading} />
          </motion.div>
        )}
        {!showPlaylistForm && (
          <motion.div
            key="playlistList"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {playlists.length === 0 && !loading && !error ? (
              <Typography 
                variant="h6" 
                sx={{ 
                  textAlign: 'center', 
                  mt: 5, 
                  color: 'text.primary',
                  fontStyle: 'italic'
                }}
              >
                You haven't created any playlists yet.
              </Typography>
            ) : (
              <PlaylistList 
                playlists={playlists} 
                onSelect={handleSelectPlaylist} 
                itemVariants={itemVariants}
                selectedPlaylistId={selectedPlaylist?._id} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            key="playlistDetails"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: '40px' }}
          >
            <PlaylistDetails 
              playlist={selectedPlaylist} 
              onRemoveVideo={handleRemoveVideo}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default PlaylistPage;