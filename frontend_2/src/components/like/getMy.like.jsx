import { useCallback, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import api, { getErrorMessage } from '../../api.js';
import { useVideoPlayer } from '../video/handleView.video.jsx';
import VideoCard, { VideoGrid, VideoGridItem } from '../common/VideoCard.jsx';
import VideoPlayerModal from '../homepage/VideoPlayerModal.jsx';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../common/PageState.jsx';

const GetMyLikes = ({ currentUser }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedVideo, play, close } = useVideoPlayer(setVideos);

  const fetchLikedVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/likes/liked-videos');
      setVideos((data.data || []).map((item) => item.likedVideo).filter(Boolean));
    }
    catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch liked videos.'));
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLikedVideos();
  }, [fetchLikedVideos]);

  return (
    <Box>
      <PageHeader
        title="Liked Videos"
        subtitle={!loading && !error ? `${videos.length} ${videos.length === 1 ? 'video' : 'videos'}` : undefined}
      />

      {loading ? (
        <LoadingState label="Loading liked videos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLikedVideos} />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={<ThumbUpOutlinedIcon />}
          title="No liked videos yet"
          description="Videos you like will show up here."
          action={<Button variant="contained" onClick={() => navigate('/')}>Browse videos</Button>}
        />
      ) : (
        <VideoGrid>
          {videos.map((video) => (
            <VideoGridItem key={video._id}>
              <VideoCard video={video} onPlay={play} />
            </VideoGridItem>
          ))}
        </VideoGrid>
      )}

      <VideoPlayerModal selectedVideo={selectedVideo} handleClose={close} currentUser={currentUser} />
    </Box>
  );
};

export default GetMyLikes;
