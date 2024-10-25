import React, { useState, useEffect } from 'react';
import axios from 'axios';

import like from '../../Images_Used/image_5.png'

const VideoLike = ({ videoId, accessToken }) => {
  const [likeCount, setLikeCount] = useState(0); // State to store like count
  const [isLiked, setIsLiked] = useState(false); // State to track if user liked the video

  // Fetch like count and liked state for the video
  const fetchLikeData = async () => {
    try {
      // Fetch like count
      const countResponse = await axios.get(
        `https://web-development-project-5-streaming-platform.vercel.app/api/version_1/likes/video/${videoId}/like-count`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const count = countResponse.data.data.likeCount;
      setLikeCount(count); // Set like count in state

      // Fetch user's liked state
      const userLikedResponse = await axios.get(
        `https://web-development-project-5-streaming-platform.vercel.app/api/version_1/likes/video/${videoId}/user-liked`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsLiked(userLikedResponse.data.isLiked); // Set the user's liked state
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  // Function to handle liking/unliking a video
  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `https://web-development-project-5-streaming-platform.vercel.app/api/version_1/likes/video/${videoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        // Refetch like data to ensure count and liked state are accurate
        fetchLikeData();
      }
    } catch (error) {
      console.error('Error liking/unliking video:', error);
    }
  };

  // Fetch like data when component mounts or when accessToken or videoId changes
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