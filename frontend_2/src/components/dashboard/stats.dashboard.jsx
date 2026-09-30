import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { motion } from 'framer-motion';
import api, { getErrorMessage } from '../../api.js';
import { formatCount } from '../../utils/format.js';
import { useVideoPlayer } from '../video/handleView.video.jsx';
import VideoCard, { VideoGrid, VideoGridItem } from '../common/VideoCard.jsx';
import VideoPlayerModal from '../homepage/VideoPlayerModal.jsx';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../common/PageState.jsx';

const STAT_CARDS = [
  { key: 'totalSubscribers', label: 'Subscribers', icon: SubscriptionsIcon, color: '#2196F3' },
  { key: 'totalViews', label: 'Total views', icon: VisibilityIcon, color: '#FFB300' },
  { key: 'totalLikes', label: 'Total likes', icon: ThumbUpIcon, color: '#FF4136' },
  { key: 'totalVideos', label: 'Videos', icon: VideoLibraryIcon, color: '#00D4FF' },
];

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [channelStats, setChannelStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedVideo, play, close } = useVideoPlayer(setVideos);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, videosResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/video/my-videos'),
      ]);
      setChannelStats(statsResponse.data.data || {});
      setVideos(videosResponse.data.data || []);
    }
    catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard data.'));
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const uploadButton = (
    <Button variant="contained" startIcon={<FileUploadOutlinedIcon />} onClick={() => navigate('/publish-video')}>
      Upload video
    </Button>
  );

  return (
    <Box>
      <PageHeader title="Channel Dashboard" subtitle="How your channel is doing" action={uploadButton} />

      {loading ? (
        <LoadingState label="Loading your channel data..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDashboard} />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {STAT_CARDS.map(({ key, label, icon: Icon, color }, index) => (
              <Grid key={key} size={{ xs: 6, md: 3 }}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  sx={{
                    p: { xs: 2, md: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'rgba(22,22,22,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: 2,
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${color}22`,
                      color,
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {formatCount(channelStats[key])}
                    </Typography>
                    <Typography variant="body2" noWrap>{label}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Your videos
          </Typography>
          {videos.length === 0 ? (
            <EmptyState
              icon={<VideoLibraryIcon />}
              title="You haven't uploaded anything yet"
              description="Publish your first video to start growing your channel."
              action={uploadButton}
            />
          ) : (
            <VideoGrid>
              {videos.map((video) => (
                <VideoGridItem key={video._id}>
                  <VideoCard video={video} owner={null} onPlay={play} />
                </VideoGridItem>
              ))}
            </VideoGrid>
          )}
        </>
      )}

      <VideoPlayerModal
        selectedVideo={selectedVideo}
        owner={currentUser}
        handleClose={close}
        currentUser={currentUser}
      />
    </Box>
  );
};

export default Dashboard;
