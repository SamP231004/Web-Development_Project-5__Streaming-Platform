import { useCallback, useEffect, useState } from 'react';
import api from '../../api.js';

export const getJoinedChannels = () => {
  try {
    return JSON.parse(localStorage.getItem('joinedChannels') || '[]');
  }
  catch {
    return [];
  }
};

export const useJoinChannel = (channelId, username) => {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  // Checkout finishes in another tab, which updates localStorage and fires `storage` here.
  useEffect(() => {
    const checkJoined = () => setJoined(getJoinedChannels().includes(channelId));
    checkJoined();
    window.addEventListener('storage', checkJoined);
    return () => window.removeEventListener('storage', checkJoined);
  }, [channelId]);

  // Opens Stripe checkout; throws if the session can't be created.
  const join = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/payment/create-checkout-session', { channelId, username });
      const checkoutTab = window.open(data.url, '_blank');
      if (checkoutTab) checkoutTab.opener = null;
      else window.location.assign(data.url); // popup blocked
    }
    finally {
      setLoading(false);
    }
  }, [channelId, username]);

  return { joined, loading, join };
};
