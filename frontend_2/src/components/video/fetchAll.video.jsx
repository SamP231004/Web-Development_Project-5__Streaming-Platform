import api, { getErrorMessage } from '../../api.js';

// The backend paginates (10 per page by default), so always ask for an explicit page.
export const fetchAllVideos = async ({ page = 1, limit = 24 } = {}) => {
  try {
    const { data } = await api.get('/video', { params: { page, limit } });
    return {
      videos: data.data?.docs || [],
      hasNextPage: !!data.data?.hasNextPage,
      totalDocs: data.data?.totalDocs ?? 0,
    };
  }
  catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to load videos. Please try again later.'));
  }
};
