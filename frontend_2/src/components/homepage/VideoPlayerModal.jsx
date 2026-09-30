import { Dialog, Box, Typography, IconButton, Avatar, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import VideoLike from '../like/video.like.jsx';
import ToggleSubscriptionButton from '../subscription/ToggleSubscriptionButton.jsx';
import JoinChannelButton from '../payment/JoinChannelButton.jsx';
import GetVideoComments from '../comment/getVideo.comment.jsx';
import { getOwnerId } from '../video/handleView.video.jsx';
import { formatCount, timeAgo } from '../../utils/format.js';

const VideoPlayerModal = ({ selectedVideo, handleClose, currentUser, owner = selectedVideo?.ownerDetails }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const ownerId = getOwnerId(selectedVideo) || owner?._id;
  const isOwnVideo = !!currentUser?._id && ownerId === currentUser._id;

  return (
    <Dialog
      open={!!selectedVideo}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      aria-labelledby="video-player-title"
      PaperProps={{
        sx: {
          bgcolor: '#0f0f0f',
          backgroundImage: 'none',
          border: { sm: '1px solid rgba(0, 212, 255, 0.15)' },
          boxShadow: '0 0 60px rgba(0, 212, 255, 0.12)',
          borderRadius: { xs: 0, sm: 4 },
        },
      }}
    >
      {selectedVideo && (
        <>
          <IconButton
            onClick={handleClose}
            aria-label="Close player"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              bgcolor: 'rgba(0,0,0,0.6)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.85)', color: 'primary.main' },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ bgcolor: 'black', aspectRatio: '16 / 9', maxHeight: '70vh', width: '100%' }}>
            {selectedVideo.videoFile ? (
              <video
                key={selectedVideo._id}
                src={selectedVideo.videoFile}
                poster={selectedVideo.thumbnail}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2">This video is unavailable.</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto' }}>
            <Typography id="video-player-title" variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {selectedVideo.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {owner && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 'auto' }}>
                  <Avatar src={owner.avatar} alt={owner.username}>
                    {owner.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{owner.username}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                {!isOwnVideo && ownerId && (
                  <>
                    <ToggleSubscriptionButton channelId={ownerId} size="medium" />
                    <JoinChannelButton channelId={ownerId} username={owner?.username} size="medium" />
                  </>
                )}
                <VideoLike videoId={selectedVideo._id} />
              </Box>
            </Box>

            <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                {formatCount(selectedVideo.views)} views
                {selectedVideo.createdAt && ` • ${timeAgo(selectedVideo.createdAt)}`}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                {selectedVideo.description || 'No description.'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Comments</Typography>
            <GetVideoComments videoId={selectedVideo._id} />
          </Box>
        </>
      )}
    </Dialog>
  );
};

export default VideoPlayerModal;
