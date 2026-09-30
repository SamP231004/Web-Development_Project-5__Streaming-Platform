import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { motion, AnimatePresence } from "framer-motion";
import api, { getErrorMessage } from "../../api.js";
import { useNotify } from "../common/Notify.jsx";
import { PageHeader, LoadingState, ErrorState, EmptyState } from "../common/PageState.jsx";

import PlaylistForm from "./PlaylistForm";
import PlaylistCard from "./PlaylistCard";
import PlaylistDetails from "./PlaylistDetails";

const PlaylistPage = ({ currentUser }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const notify = useNotify();

  const userId = currentUser?._id;
  const selectedPlaylist = playlists.find((p) => p._id === selectedId) || null;

  const fetchPlaylists = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/playlist/user/${userId}`);
      setPlaylists(data?.data || []);
    }
    catch (err) {
      setError(getErrorMessage(err, "Failed to load playlists."));
    }
    finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Throws on failure so the form can show the error and stay open.
  const handleCreatePlaylist = async (formData) => {
    const { data } = await api.post("/playlist", formData);
    setPlaylists((prev) => [...prev, { ...data.data, videos: [], totalVideos: 0, totalViews: 0 }]);
    notify("Playlist created", "success");
  };

  const handleRemoveVideo = async (videoId) => {
    const playlistId = selectedId;
    const snapshot = playlists;

    setPlaylists((prev) => prev.map((p) => {
      if (p._id !== playlistId) return p;
      const videos = p.videos.filter((v) => v._id !== videoId);
      const removed = p.videos.find((v) => v._id === videoId);
      return { ...p, videos, totalVideos: videos.length, totalViews: (p.totalViews || 0) - (removed?.views || 0) };
    }));

    try {
      await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
    }
    catch (err) {
      setPlaylists(snapshot);
      notify(getErrorMessage(err, "Failed to remove video."), "error");
    }
  };

  const newPlaylistButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowPlaylistForm(true)}>
      New playlist
    </Button>
  );

  return (
    <Box>
      <PageHeader title="Your Playlists" subtitle="Organise the videos you want to come back to" action={newPlaylistButton} />

      {loading ? (
        <LoadingState label="Loading your playlists..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPlaylists} />
      ) : playlists.length === 0 ? (
        <EmptyState
          icon={<QueueMusicIcon />}
          title="No playlists yet"
          description="Create a playlist, then save videos to it from the home page."
          action={newPlaylistButton}
        />
      ) : (
        <Grid container spacing={3}>
          {playlists.map((playlist, index) => (
            <Grid
              key={playlist._id}
              size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PlaylistCard
                playlist={playlist}
                isOpen={playlist._id === selectedId}
                onClick={() => setSelectedId((prev) => (prev === playlist._id ? null : playlist._id))}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            key={selectedPlaylist._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 32 }}
          >
            <PlaylistDetails
              playlist={selectedPlaylist}
              onRemoveVideo={handleRemoveVideo}
              onClose={() => setSelectedId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PlaylistForm open={showPlaylistForm} onClose={() => setShowPlaylistForm(false)} onSubmit={handleCreatePlaylist} />
    </Box>
  );
};

export default PlaylistPage;
