import React, { useEffect, useState } from "react";
import axios from "axios";
import GetLike from './get.like.jsx';
import { handleWatch } from '../video/handleView.video.jsx';

const GetMyLikes = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [errorMsg, setErrorMessage] = useState('');

  // Fetch liked videos from the backend
  const fetchLikedVideos = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.get("https://web-development-project-5-streaming-platform.vercel.app/api/version_1/likes/liked-videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLikedVideos(response.data?.data || []);
      setVideos(response.data?.data.map((v) => v.likedVideo) || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch liked videos. Please log in.");
      setLoading(false);
    }
  };

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
    handleWatch(video, videos, setVideos, setErrorMessage);
    handleWatchNow(video);
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2><center>Liked Videos</center></h2>
      {likedVideos.length === 0 ? (
        <p>You haven't liked any videos yet.</p>
      ) : (
        <div className="videosContainer">
          {likedVideos.map((videoData) => {
            const video = videoData.likedVideo;
            return (
              <div
                key={video._id}
                className="video-card"
                onClick={() => handleVideoPlay(video)}
                style={{ cursor: 'pointer' }}
              >
                <div className='videoThumnailContainer'>
                  <img src={video.thumbnail} alt={`${video.title} Thumbnail`} className="video-thumbnail" />
                  <p className='video-duration'>{video.duration.toFixed(2)} sec</p>
                </div>
                <div className='videoRestPart'>
                  <h3>{video.title}</h3>
                  <div className='viewsLike'>
                    <p className='video-views'>{video.views} views</p>
                    <span>.</span>
                    <GetLike videoId={video._id} accessToken={localStorage.getItem('accessToken')} />
                  </div>
                </div>
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
          </video>
          <p ><u>Video Description :</u></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{selectedVideo.description}</p>
        </div>
      )}
    </div>
  );
};

export default GetMyLikes;