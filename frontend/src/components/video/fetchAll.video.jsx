import axios from 'axios';

export const fetchAllVideos = async (accessToken) => {
  try {
    const response = await axios.get('https://streamingplatformbackend.onrender.com/api/version_1/video', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.success) {
      return response.data.data.docs;
    } 
    else {
      throw new Error('Failed to load videos: Please try again later.');
    }
  } 
  catch (error) {
    throw new Error('An unexpected error occurred.');
  }
};