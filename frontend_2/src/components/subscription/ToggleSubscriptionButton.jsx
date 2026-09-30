import { Button, CircularProgress } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useNotify } from '../common/Notify.jsx';
import { useSubscription } from './useSubscription.js';

const ToggleSubscriptionButton = ({ channelId, size = 'small' }) => {
  const { isSubscribed, loading, toggle, canSubscribe } = useSubscription(channelId);
  const notify = useNotify();

  const handleToggle = async (event) => {
    event.stopPropagation();
    try {
      const subscribed = await toggle();
      notify(subscribed ? 'Subscribed to channel' : 'Unsubscribed from channel', 'success');
    }
    catch (error) {
      console.error('Toggle error:', error);
      notify('Failed to update subscription.', 'error');
    }
  };

  if (!canSubscribe) return null;

  return (
    <Button
      size={size}
      variant={isSubscribed ? 'outlined' : 'contained'}
      color={isSubscribed ? 'inherit' : 'primary'}
      onClick={handleToggle}
      disabled={loading || isSubscribed === null}
      startIcon={isSubscribed ? <NotificationsActiveOutlinedIcon fontSize="small" /> : null}
      sx={{
        borderRadius: 999,
        px: size === 'small' ? 1.75 : 2.25,
        py: 0,
        minHeight: size === 'small' ? 32 : 38,
        minWidth: size === 'small' ? 100 : 120,
        fontSize: size === 'small' ? '0.85rem' : '0.95rem',
        whiteSpace: 'nowrap',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
        ...(isSubscribed && { borderColor: 'rgba(255,255,255,0.3)', color: 'text.primary' }),
      }}
    >
      {loading ? <CircularProgress size={18} color="inherit" /> : isSubscribed ? 'Subscribed' : 'Subscribe'}
    </Button>
  );
};

export default ToggleSubscriptionButton;
