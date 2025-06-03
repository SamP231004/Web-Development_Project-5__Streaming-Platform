import { useEffect, useState } from "react";
import axios from "axios";
import { handleWatch } from "../video/handleView.video.jsx"; // Assuming this path is correct

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MySubscribedChannels = ({ subscriberId }) => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [errorMsg, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Please log in.");

        if (!subscriberId) {
          setError("No subscriber ID found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/version_1/subscriptions/user/${subscriberId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API response data for subscribed channels:", response.data?.data);

        setSubscribedChannels(response.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch channels.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [subscriberId]);

  // Updated handleVideoPlay: no backend call, just use the video passed in
  const handleVideoPlay = (video) => {
    if (!video.videoFile) {
      setErrorMessage("Video URL not available.");
      return;
    }
    handleWatch(video, [video], setVideos, setErrorMessage);
    setSelectedVideo(video);
  };

  const handleCloseVideoPlayer = () => setSelectedVideo(null);

  if (loading) return <div>Loading your subscribed channels...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="my-subscribed-channels-container">
      <h2>
        <center>My Subscribed Channels</center>
      </h2>
      {subscribedChannels.length === 0 ? (
        <p>You haven't subscribed to any channels yet.</p>
      ) : (
        <div className="channels-grid">
          {subscribedChannels.map((item) => {
            const subscribedChannel = item.subscribedChannel;

            if (!subscribedChannel) {
              console.warn("Skipping item due to missing 'subscribedChannel' property:", item);
              return null;
            }

            // Destructure properties from subscribedChannel
            const { _id, avatar, username, fullName, latestVideo } = subscribedChannel;

            return (
              <div key={_id} className="channel-card">
                <img
                  src={avatar || "https://via.placeholder.com/150"}
                  alt={`${username} Avatar`}
                  className="channel-avatar"
                />
                <h3>{fullName}</h3>
                <p>@{username}</p>

                {latestVideo ? (
                  <div
                    className="latest-video-preview"
                    onClick={() => handleVideoPlay(latestVideo)}
                    style={{ cursor: "pointer" }}
                  >
                    <h4>Latest Video:</h4>
                    <img
                      src={latestVideo.thumbnail || "https://via.placeholder.com/200x112"}
                      alt={latestVideo.title}
                      className="latest-video-thumbnail"
                    />
                    <p>{latestVideo.title}</p>
                    <p className="video-duration">{latestVideo.duration?.toFixed(2)} sec</p>
                    <p className="video-views">{latestVideo.views || 0} views</p>
                  </div>
                ) : (
                  <p>No videos published yet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedVideo && (
        <div className="video-player">
          <div className="video-header">
            <h2>{selectedVideo.title}</h2>
            <button onClick={handleCloseVideoPlayer} className="btn btn-close">
              &times;
            </button>
          </div>
          <video controls>
            <source src={selectedVideo.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>
            <u>Video Description:</u>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{selectedVideo.description}</p>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </div>
      )}
    </div>
  );
};

export default MySubscribedChannels;