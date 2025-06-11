import { useState, useEffect } from 'react';
import axios from 'axios';

import like from '../../Images_Used/image_5.png'

const API_URL = import.meta.env.VITE_BACKEND_URL;

const VideoLike = ({ videoId, accessToken }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const fetchLikeData = async () => {
    try {
      const countResponse = await axios.get(
        `${API_URL}/api/version_1/likes/video/${videoId}/like-count`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const count = countResponse.data.data.likeCount;
      setLikeCount(count); 

      const userLikedResponse = await axios.get(
        `${API_URL}/api/version_1/likes/video/${videoId}/user-liked`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsLiked(userLikedResponse.data.isLiked); 
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/version_1/likes/video/${videoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        fetchLikeData();
      }
    } 
    catch (error) {
      console.error('Error liking/unliking video:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchLikeData();
    }
  }, [accessToken, videoId]);

  return (
    <div className="like-section">
      <img
        src={like}
        alt={isLiked ? "Unlike" : "Like"}
        onClick={toggleLike}
        className="like-button"
      />
      <p className="like-count">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</p>
    </div>
  );
};

export default VideoLike;