import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Avatar, Typography, Grid } from '@mui/material';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { motion } from 'framer-motion';
import api, { getErrorMessage } from '../../api.js';
import { useVideoPlayer } from '../video/handleView.video.jsx';
import VideoCard from '../common/VideoCard.jsx';
import VideoPlayerModal from '../homepage/VideoPlayerModal.jsx';
import ToggleSubscriptionButton from './ToggleSubscriptionButton.jsx';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../common/PageState.jsx';

const toOwner = ({ _id, username, avatar }) => ({ _id, username, avatar });

const MySubscribedChannels = ({ currentUser }) => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingOwner, setPlayingOwner] = useState(null);
  const { selectedVideo, play, close } = useVideoPlayer();

  const subscriberId = currentUser?._id;

  const fetchChannels = useCallback(async () => {
    if (!subscriberId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/subscriptions/user/${subscriberId}`);
      setChannels((data.data || []).map((item) => item.subscribedChannel).filter(Boolean));
    }
    catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch channels.'));
    }
    finally {
      setLoading(false);
    }
  }, [subscriberId]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handlePlay = (channel) => (video) => {
    setPlayingOwner(toOwner(channel));
    play(video);
  };

  return (
    <Box>
      <PageHeader title="Subscriptions" subtitle="The latest upload from every channel you follow" />

      {loading ? (
        <LoadingState label="Loading your subscriptions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchChannels} />
      ) : channels.length === 0 ? (
        <EmptyState
          icon={<SubscriptionsOutlinedIcon />}
          title="No subscriptions yet"
          description="Subscribe to channels to see their latest videos here."
          action={<Button variant="contained" onClick={() => navigate('/')}>Discover channels</Button>}
        />
      ) : (
        <Grid container spacing={3}>
          {channels.map((channel, index) => (
            <Grid
              key={channel._id}
              size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
                <Card sx={{ bgcolor: 'rgba(22,22,22,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar src={channel.avatar} alt={channel.username} sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.main' }}>
                      {channel.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>{channel.username}</Typography>
                      <Typography variant="body2" noWrap>{channel.fullName}</Typography>
                    </Box>
                    <ToggleSubscriptionButton channelId={channel._id} />
                  </CardContent>
                </Card>
                {channel.latestVideo ? (
                  <VideoCard video={channel.latestVideo} owner={null} onPlay={handlePlay(channel)} />
                ) : (
                  <Box sx={{ flexGrow: 1, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="body2">No videos uploaded yet</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <VideoPlayerModal
        selectedVideo={selectedVideo}
        owner={playingOwner}
        handleClose={close}
        currentUser={currentUser}
      />
    </Box>
  );
};

export default MySubscribedChannels;
