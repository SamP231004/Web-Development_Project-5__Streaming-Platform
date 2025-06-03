import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAllVideos } from './video/fetchAll.video.jsx';
import { handleWatch } from './video/handleView.video.jsx';
import GetLike from './like/get.like.jsx';
import VideoLike from './like/video.like.jsx';
import GetVideoComments from './comment/getVideo.comment.jsx';
import ToggleSubscriptionButton from './subscription/ToggleSubscriptionButton.jsx';
import axios from 'axios';

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

  // Fetch videos
  const fetchVideos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const videoData = await fetchAllVideos(token);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load videos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch playlists of current user
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
  }, [location.pathname]);

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

  // When user selects playlist in dropdown for a video
  const onSelectPlaylist = (videoId, playlistId) => {
    setSelectedPlaylistForVideo((prev) => ({
      ...prev,
      [videoId]: playlistId,
    }));
  };

  // Add video to playlist API call
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
      // Optionally: refresh playlists or videos or UI state here
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add video to playlist.');
    } finally {
      setAddingVideoId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="homepage">
        <h2>Welcome to our platform!</h2>
        <p>Please log in or register to view videos.</p>
        <button onClick={() => navigate('/login')} className="btn btn-login">Login</button>
        <button onClick={() => navigate('/register')} className="btn btn-register">Register</button>
      </div>
    );
  }

  return (
    <div className="container">
      {isLoading ? (
        <p>Loading videos...</p>
      ) : errorMsg ? (
        <p className="error-message">{errorMsg}</p>
      ) : videos.length > 0 ? (
        <>
          <div className="contentContainer">
            <div className="showContainer" style={{ position: 'relative' }}>
              {videos.slice(0, 5).map((video) => (
                <div
                  key={video._id}
                  className="video-card"
                  style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                  onMouseEnter={() => handleMouseEnter(video)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="videoThumnailContainer showContainerThumbnail">
                    <img
                      src={video.thumbnail}
                      alt={`${video.title} Thumbnail`}
                      className="video-thumbnail"
                    />
                  </div>
                  <div className="videoRestPart"></div>
                </div>
              ))}
              {hoveredVideo?.videoFile && (
                <video
                  src={hoveredVideo.videoFile}
                  autoPlay
                  loop
                  muted
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50px',
                    objectFit: 'cover',
                    zIndex: 0,
                  }}
                />
              )}
            </div>

            <div className="videosContainer">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="video-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="videoThumnailContainer"
                    onClick={() => handleVideoPlay(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={`${video.title} Thumbnail`}
                      className="video-thumbnail"
                    />
                    <p className="video-duration">{video.duration.toFixed(2)} sec</p>
                  </div>
                  <div className="videoRestPart">
                    <h3>{video.title}</h3>
                    <div className="viewsLike">
                      <p className="video-views">{video.views} views</p>
                      <span>.</span>
                      <GetLike videoId={video._id} accessToken={token} />
                    </div>
                    {video.ownerDetails?._id && currentUser._id !== video.ownerDetails._id && (
                      <ToggleSubscriptionButton channelId={video.ownerDetails._id} />
                    )}

                    {/* Playlist Add UI */}
                    <div style={{ marginTop: '10px' }}>
                      <select
                        value={selectedPlaylistForVideo[video._id] || ''}
                        onChange={(e) => onSelectPlaylist(video._id, e.target.value)}
                      >
                        <option value="">Add to Playlist</option>
                        {playlists.map((playlist) => (
                          <option key={playlist._id} value={playlist._id}>
                            {playlist.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => addVideoToPlaylist(video._id)}
                        disabled={addingVideoId === video._id}
                        style={{ marginLeft: '8px' }}
                      >
                        {addingVideoId === video._id ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>No videos available.</p>
      )}

      {selectedVideo?.videoFile && (
        <div className="video-player">
          <div className="video-header">
            <h2>{selectedVideo.title}</h2>
            <button onClick={handleCloseVideoPlayer} className="btn btn-close">&times;</button>
          </div>
          <video controls onPlay={() => handleVideoPlay(selectedVideo)}>
            <source src={selectedVideo.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <VideoLike videoId={selectedVideo._id} accessToken={token} />
          <p><u>Video Description :</u></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{selectedVideo.description}</p>
          <p><u>Comments :</u></p>
          <GetVideoComments videoId={selectedVideo._id} />
        </div>
      )}
    </div>
  );
};

export default Homepage;