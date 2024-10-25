import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetLike = ({ videoId, accessToken }) => {
  const [likeCount, setLikeCount] = useState(0);

  const fetchLikeData = async () => {
    try {
      const countResponse = await axios.get(
        `http://localhost:8000/api/version_1/likes/video/${videoId}/like-count`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLikeCount(countResponse.data.data.likeCount);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchLikeData();
    }
  }, [accessToken, videoId]);

  return <p className="like-count">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</p>;
};

export default GetLike;