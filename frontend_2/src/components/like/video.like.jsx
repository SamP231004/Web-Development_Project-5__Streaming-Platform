import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import api from '../../api.js';
import { formatCount } from '../../utils/format.js';
import { useNotify } from '../common/Notify.jsx';

const VideoLike = ({ videoId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const notify = useNotify();

  useEffect(() => {
    if (!videoId) return;
    let active = true;

    Promise.all([
      api.get(`/likes/video/${videoId}/like-count`),
      api.get(`/likes/video/${videoId}/user-liked`),
    ])
      .then(([countRes, likedRes]) => {
        if (!active) return;
        setLikeCount(countRes.data.data.likeCount);
        setIsLiked(!!likedRes.data.data?.isLiked);
      })
      .catch((error) => console.error('Error fetching like data:', error));

    return () => { active = false; };
  }, [videoId]);

  const toggleLike = async () => {
    const wasLiked = isLiked;
    setPending(true);
    setIsLiked(!wasLiked);
    setLikeCount((count) => count + (wasLiked ? -1 : 1));
    try {
      const { data } = await api.post(`/likes/video/${videoId}/like`);
      setIsLiked(!!data.data?.isLiked);
    }
    catch (error) {
      console.error('Error liking/unliking video:', error);
      setIsLiked(wasLiked);
      setLikeCount((count) => count + (wasLiked ? 1 : -1));
      notify('Could not update your like. Please try again.', 'error');
    }
    finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant={isLiked ? 'contained' : 'outlined'}
      color="primary"
      onClick={toggleLike}
      disabled={pending}
      startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
      aria-pressed={isLiked}
      sx={{ borderRadius: 999, px: 2, py: 0.75 }}
    >
      {formatCount(likeCount)}
    </Button>
  );
};

export default VideoLike;
