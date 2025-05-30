import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAllVideos } from './video/fetchAll.video.jsx';
import { handleWatch } from './video/handleView.video.jsx';
import GetLike from './like/get.like.jsx';
import VideoLike from './like/video.like.jsx';
import GetVideoComments from './comment/getVideo.comment.jsx';

const Homepage = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMessage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const fetchVideos = async () => {
    const accessToken = localStorage.getItem('accessToken');
    setIsLoading(true);
    try {
      const videoData = await fetchAllVideos(accessToken);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/') {
      fetchVideos();
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

  if (!currentUser) {
    return (
      <div className="homepage">
        <h2>Welcome to our platform!</h2>
        <p>Please log in or register to view videos.</p>
        <button onClick={() => navigate('/login')} className="btn btn-login">
          Login
        </button>
        <button onClick={() => navigate('/register')} className="btn btn-register">
          Register
        </button>
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
                  <img src={video.thumbnail} alt={`${video.title} Thumbnail`} className="video-thumbnail" />
                </div>
                <div className="videoRestPart"></div>
              </div>
            ))}
            {hoveredVideo && hoveredVideo.videoFile && (
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
                onClick={() => handleVideoPlay(video)}
                style={{ cursor: 'pointer' }}
              >
                <div className="videoThumnailContainer">
                  <img src={video.thumbnail} alt={`${video.title} Thumbnail`} className="video-thumbnail" />
                  <p className="video-duration">{video.duration.toFixed(2)} sec</p>
                </div>
                <div className="videoRestPart">
                  <h3>{video.title}</h3>
                  <div className="viewsLike">
                    <p className="video-views">{video.views} views</p>
                    <span>.</span>
                    <GetLike videoId={video._id} accessToken={localStorage.getItem('accessToken')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No videos available.</p>
      )}

      {selectedVideo && selectedVideo.videoFile && (
        <div className="video-player">
          <div className="video-header">
            <h2>{selectedVideo.title}</h2>
            <button onClick={handleCloseVideoPlayer} className="btn btn-close">
              &times;
            </button>
          </div>
          <video controls onPlay={() => handleVideoPlay(selectedVideo)}>
            <source src={selectedVideo.videoFile} type="video/mp4" />
          </video>
          <VideoLike videoId={selectedVideo._id} accessToken={localStorage.getItem('accessToken')} />
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
