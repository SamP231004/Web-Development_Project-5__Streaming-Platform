import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, ListSubheader, CircularProgress, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import VideoCard, { VideoGrid, VideoGridItem } from '../common/VideoCard.jsx';
import { useNotify } from '../common/Notify.jsx';
import { useSubscription } from '../subscription/useSubscription.js';
import { useJoinChannel } from '../payment/useJoinChannel.js';
import api, { getErrorMessage } from '../../api.js';

const VideoMenu = ({ video, playlists, isOwn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [saving, setSaving] = useState(false);
  const notify = useNotify();
  const navigate = useNavigate();
  const open = !!anchorEl;

  const channel = video.ownerDetails;
  const showChannelItems = !isOwn && !!channel?._id;
  const subscription = useSubscription(showChannelItems ? channel._id : null, { enabled: open });
  const membership = useJoinChannel(channel?._id, channel?.username);

  const close = () => setAnchorEl(null);

  const addToPlaylist = async (playlist) => {
    close();
    setSaving(true);
    try {
      await api.patch(`/playlist/add/${video._id}/${playlist._id}`);
      notify(`Saved to "${playlist.name}"`, 'success');
    }
    catch (error) {
      notify(getErrorMessage(error, 'Failed to add video to playlist.'), 'error');
    }
    finally {
      setSaving(false);
    }
  };

  const toggleSubscription = async () => {
    close();
    try {
      const subscribed = await subscription.toggle();
      notify(subscribed ? `Subscribed to ${channel.username}` : `Unsubscribed from ${channel.username}`, 'success');
    }
    catch {
      notify('Failed to update subscription.', 'error');
    }
  };

  const joinChannel = async () => {
    close();
    try {
      await membership.join();
    }
    catch (error) {
      notify(getErrorMessage(error, 'Failed to start payment.'), 'error');
    }
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="More options"
        aria-haspopup="menu"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={saving}
        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
      >
        {saving ? <CircularProgress size={18} color="inherit" /> : <MoreVertIcon fontSize="small" />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ dense: true }}
        slotProps={{ paper: { sx: { minWidth: 240 } } }}
      >
        {showChannelItems && [
          <MenuItem key="subscribe" onClick={toggleSubscription} disabled={subscription.isSubscribed === null || subscription.loading}>
            <ListItemIcon>
              {subscription.isSubscribed ? <NotificationsOffOutlinedIcon fontSize="small" /> : <NotificationsNoneIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText
              primary={subscription.isSubscribed === null ? 'Checking subscription...' : subscription.isSubscribed ? `Unsubscribe from ${channel.username}` : `Subscribe to ${channel.username}`}
            />
          </MenuItem>,
          <MenuItem key="join" onClick={joinChannel} disabled={membership.joined || membership.loading}>
            <ListItemIcon><WorkspacePremiumOutlinedIcon fontSize="small" sx={{ color: 'secondary.main' }} /></ListItemIcon>
            <ListItemText
              primary={membership.joined ? 'You are a member' : 'Join channel'}
              secondary={membership.joined ? null : '₹100 membership'}
            />
          </MenuItem>,
          <Divider key="divider" />,
        ]}
        <ListSubheader sx={{ bgcolor: 'transparent', lineHeight: '32px', fontSize: '0.75rem' }}>
          Save to playlist
        </ListSubheader>
        {playlists.map((playlist) => (
          <MenuItem key={playlist._id} onClick={() => addToPlaylist(playlist)}>
            <ListItemIcon><QueueMusicIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{playlist.name}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem onClick={() => navigate('/playlist')}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>New playlist</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const AllVideos = ({ videos, playlists, currentUser, onPlay }) => (
  <VideoGrid>
    {videos.map((video) => (
      <VideoGridItem key={video._id}>
        <VideoCard
          video={video}
          onPlay={onPlay}
          menu={(
            <VideoMenu
              video={video}
              playlists={playlists}
              isOwn={video.ownerDetails?._id === currentUser?._id}
            />
          )}
        />
      </VideoGridItem>
    ))}
  </VideoGrid>
);

export default AllVideos;
