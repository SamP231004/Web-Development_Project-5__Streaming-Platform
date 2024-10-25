export const handleWatch = async (video, videos, setVideos, setErrorMessage) => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    // Send a request to increment the view count
    const response = await fetch(`http://localhost:8000/api/version_1/video/${video._id}/increment-views`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Failed to update view count');
    }

    // Optionally, retrieve the updated video data from the server
    const updatedVideo = await response.json();

    // Update the local state to reflect the new view count
    const updatedVideos = videos.map((v) =>
      v._id === video._id ? { ...v, views: updatedVideo.data.views } : v
    );
    setVideos(updatedVideos);

  } catch (error) {
    setErrorMessage(error.message);
  }
};