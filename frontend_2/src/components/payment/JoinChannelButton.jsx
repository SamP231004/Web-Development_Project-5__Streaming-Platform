import { Button, Tooltip, CircularProgress } from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { getErrorMessage } from '../../api.js';
import { useNotify } from '../common/Notify.jsx';
import { useJoinChannel } from './useJoinChannel.js';

const JoinChannelButton = ({ channelId, username, size = 'small' }) => {
  const { joined, loading, join } = useJoinChannel(channelId, username);
  const notify = useNotify();

  const handleJoin = async (event) => {
    event.stopPropagation();
    try {
      await join();
    }
    catch (error) {
      notify(getErrorMessage(error, 'Failed to start payment.'), 'error');
    }
  };

  return (
    <Tooltip title={joined ? 'You are a member of this channel' : 'Become a channel member for ₹100'} arrow>
      <span>
        <Button
          size={size}
          variant="outlined"
          color={joined ? 'success' : 'secondary'}
          disabled={joined || loading}
          onClick={handleJoin}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <WorkspacePremiumOutlinedIcon fontSize="small" />}
          sx={{
            borderRadius: 999,
            px: size === 'small' ? 1.5 : 2.25,
            py: 0,
            minHeight: size === 'small' ? 32 : 38,
            fontSize: size === 'small' ? '0.85rem' : '0.95rem',
            whiteSpace: 'nowrap',
            boxShadow: 'none',
            borderColor: joined ? undefined : 'rgba(0, 212, 255, 0.4)',
            '& .MuiButton-startIcon': { mr: 0.5 },
          }}
        >
          {joined ? 'Member' : 'Join'}
        </Button>
      </span>
    </Tooltip>
  );
};

export default JoinChannelButton;
