import { useCallback, useEffect, useState } from 'react';
import api, { getStoredUser } from '../../api.js';

// Many cards can show the same channel, so share one status lookup per channel
// and broadcast changes so every control for that channel stays in sync.
const statusCache = new Map();
const CHANGE_EVENT = 'subscription:changed';

const fetchStatus = (channelId, userId) => {
  if (!statusCache.has(channelId)) {
    const request = api
      .get(`/subscriptions/channel/${channelId}`)
      .then(({ data }) => (data.data || []).some(({ subscriber }) => subscriber?._id === userId))
      .catch((error) => {
        statusCache.delete(channelId);
        throw error;
      });
    statusCache.set(channelId, request);
  }
  return statusCache.get(channelId);
};

// `enabled` lets menus defer the lookup until they are opened.
export const useSubscription = (channelId, { enabled = true } = {}) => {
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = getStoredUser()?._id;
  const canSubscribe = !!userId && !!channelId && channelId !== userId;

  useEffect(() => {
    if (!canSubscribe) return undefined;

    const onChange = (event) => {
      if (event.detail.channelId === channelId) setIsSubscribed(event.detail.subscribed);
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [channelId, canSubscribe]);

  useEffect(() => {
    if (!canSubscribe || !enabled) return undefined;
    let active = true;
    fetchStatus(channelId, userId)
      .then((subscribed) => active && setIsSubscribed(subscribed))
      .catch((error) => console.error('Error checking subscription:', error));
    return () => { active = false; };
  }, [channelId, userId, canSubscribe, enabled]);

  // Resolves to the new state; throws if the request fails.
  const toggle = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/subscriptions/channel/${channelId}`);
      const subscribed = !!data.data.subscribed;
      statusCache.set(channelId, Promise.resolve(subscribed));
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { channelId, subscribed } }));
      return subscribed;
    }
    finally {
      setLoading(false);
    }
  }, [channelId]);

  return { isSubscribed, loading, toggle, canSubscribe };
};
