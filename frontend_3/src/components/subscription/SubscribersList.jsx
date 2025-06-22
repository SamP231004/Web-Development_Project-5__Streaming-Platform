import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SubscribersList = ({ channelId }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscribers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `${API_URL}/api/version_1/subscription/subscription/channel/${channelId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
                );
                setSubscribers(res.data.data);
            } 
            catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load subscribers.');
            } 
            finally {
                setLoading(false);
            }
        };

        if (channelId) fetchSubscribers();
    }, [channelId]);

    return (
        <div>
            <h3>Subscribers</h3>
            {loading && <p>Loading subscribers...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && subscribers.length === 0 && <p>No subscribers yet.</p>}
            <ul>
                {subscribers.map(({ subscriber }) => (
                    subscriber && (
                        <li key={subscriber._id}>
                            <img
                                src={subscriber.avatar?.url || 'https://via.placeholder.com/30'}
                                alt={subscriber.username}
                                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                            />
                            {subscriber.username} ({subscriber.fullName})
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default SubscribersList;