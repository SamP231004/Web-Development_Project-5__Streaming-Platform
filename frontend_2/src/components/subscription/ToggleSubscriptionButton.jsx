import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ToggleSubscriptionButton = ({ channelId }) => {
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token || !channelId) return;

        const checkSubscription = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/version_1/subscriptions/channel/${channelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Subscription API response:', res.data);
    // Set isSubscribed based on presence of subscription record
    setIsSubscribed(res.data.data.length > 0);
  } catch (err) {
    console.error('Error checking subscription:', err);
    setError('Failed to fetch subscription status.');
  }
};
5
        checkSubscription();
    }, [channelId, token]);

    const handleToggle = async () => {
        if (!token) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(
                `${API_URL}/api/version_1/subscriptions/channel/${channelId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsSubscribed(res.data.data.subscribed);
        } catch (err) {
            console.error('Toggle error:', err);
            setError('Failed to toggle subscription.');
        } finally {
            setLoading(false);
        }
    };

    // Render nothing if still loading subscription status
    if (isSubscribed === null) return null;

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                }}
                disabled={loading}
            >
                {loading ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
        </div>
    );
};

export default ToggleSubscriptionButton;