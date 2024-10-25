import React, { useEffect, useState } from 'react';

const MyVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('https://web-development-project-5-streaming-platform.vercel.app/api/version_1/video/my-videos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.success) {
                    setVideos(result.data);
                } 
                else {
                    console.error(result.message);
                }
            } 
            catch (error) {
                console.error("Error fetching videos:", error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {videos.length === 0 ? (
                <p>No videos found.</p>
            ) : (
                videos.map(video => (
                    <div key={video._id}>
                        <h2>{video.title}</h2>
                        <p>{video.description}</p>
                        <p><strong>Duration:</strong>  {video.duration.toFixed(2)} seconds</p>
                        <p><strong>Views:</strong> {video.views}</p>
                        <p><strong>Created At:</strong> {new Date(video.createdAt).toLocaleString()}</p>
                        <video src={video.videoFile} controls />
                    </div>
                ))
            )}
        </div>
    );
};

export default MyVideos;