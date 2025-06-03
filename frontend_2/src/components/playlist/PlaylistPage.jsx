import React, { useState, useEffect } from "react";
import axios from "axios";

import PlaylistForm from "./PlaylistForm";
import PlaylistList from "./PlaylistList";
import PlaylistDetails from "./PlaylistDetails";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token || !user?._id) throw new Error("User not authenticated");
      const response = await axios.get(
        `${API_URL}/api/version_1/playlist/user/${user._id}`,
        authHeaders
      );
      setPlaylists(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load playlists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (data) => {
    setLoading(true);
    setError("");
    try {
      if (!token || !user?._id) throw new Error("User not authenticated");

      const payload = { ...data, userId: user._id };
      await axios.post(`${API_URL}/api/version_1/playlist`, payload, authHeaders);
      await fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create playlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!selectedPlaylist) return;
    setLoading(true);
    setError("");
    try {
      await axios.patch(
        `${API_URL}/api/version_1/playlist/remove/${videoId}/${selectedPlaylist._id}`,
        {},
        authHeaders
      );
      // Refresh playlists and the selected playlist details
      await fetchPlaylists();
      const updated = await axios.get(
        `${API_URL}/api/version_1/playlist/${selectedPlaylist._id}`,
        authHeaders
      );
      setSelectedPlaylist(updated.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to remove video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2>Your Playlists</h2>
      <PlaylistForm onSubmit={handleCreatePlaylist} loading={loading} />
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <PlaylistList playlists={playlists} onSelect={(playlist) =>
        setSelectedPlaylist((prev) =>
          prev && prev._id === playlist._id ? null : playlist
        )
      } />
      {selectedPlaylist && (
        <PlaylistDetails playlist={selectedPlaylist} onRemoveVideo={handleRemoveVideo} />
      )}
    </div>
  );
};

export default PlaylistPage;
