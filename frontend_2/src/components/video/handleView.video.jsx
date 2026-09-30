import { useCallback, useState } from 'react';
import api from '../../api.js';

export const incrementViews = async (videoId) => {
  const { data } = await api.post(`/video/${videoId}/increment-views`);
  return data.data?.views;
};

// Returns the owner id whichever shape the backend sent the video in.
export const getOwnerId = (video) =>
  video?.ownerDetails?._id || (typeof video?.owner === 'string' ? video.owner : video?.owner?._id);

// Opens a video in the player and counts a view. A failed view count must not
// break the page, so it is only logged.
export const useVideoPlayer = (setVideos) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const play = useCallback((video) => {
    setSelectedVideo(video);
    incrementViews(video._id)
      .then((views) => {
        if (typeof views === 'number' && setVideos) {
          setVideos((prev) => prev.map((v) => (v._id === video._id ? { ...v, views } : v)));
        }
      })
      .catch((error) => console.error('Failed to update view count:', error));
  }, [setVideos]);

  const close = useCallback(() => setSelectedVideo(null), []);

  return { selectedVideo, play, close };
};
