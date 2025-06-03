import { useEffect, useState } from "react";
import axios from "axios";

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

  const fetchChannelStats = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found.");
      setError("No access token found");
      setLoading(false);
      return;
    }

    try {
      const statsResponse = await axios.get(
        `${API_URL}/api/version_1/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChannelStats(statsResponse.data.data);

      const videosResponse = await axios.get(
        `${API_URL}/api/version_1/video/my-videos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVideos(videosResponse.data.data);
    } 
    catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Error fetching data");
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelStats();
  }, []);

  const handleWatchNow = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div>
      <h1><center>Dashboard</center></h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="channel-stats">
            <h2>Channel Statistics</h2>
            <p><strong>Total Likes:</strong> {channelStats.totalLikes}</p>
            <p><strong>Total Views:</strong> {channelStats.totalViews}</p>
            <p><strong>Total Videos:</strong> {channelStats.totalVideos}</p>
          </div>

          <h2 className="channelStatsH2">My Videos</h2>
          <div className="video-list statsContainer">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div 
                  key={video._id} 
                  className="video-card stats" 
                  onClick={() => handleWatchNow(video)}
                  style={{ cursor: 'pointer' }}
                >
                  <video controls src={video.videoFile} style={{ width: '300px' }}></video>
                  <h3>{video.title}</h3>
                  <p>Views: {video.views}</p>
                  <p>Duration: {video.duration.toFixed(2)} seconds</p>
                  <p>Created At: {formatDate(video.createdAt)}</p>
                </div>
              ))
            ) : (
              <p>No videos found.</p>
            )}
          </div>
        </>
      )}

      {selectedVideo && (
        <div className="video-player" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', zIndex: 1000 }}>
          <div className="video-header">
            <h2>{selectedVideo.title}</h2>
            <button onClick={handleCloseVideoPlayer} className="btn btn-close">
              &times;
            </button>
          </div>
          <video controls>
            <source src={selectedVideo.videoFile} type="video/mp4" />
          </video>
          <p><u>Video Description :</u></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{selectedVideo.description}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;