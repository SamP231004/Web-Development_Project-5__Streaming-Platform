import axios from 'axios';

export const API_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = `${API_URL}/api/version_1`;

const api = axios.create({ baseURL: BASE_URL });

export const clearSession = () => {
  ['accessToken', 'refreshToken', 'user', 'username'].forEach((key) => localStorage.removeItem(key));
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
  catch {
    return null;
  }
};

export const saveSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getErrorMessage = (error, fallback = 'Something went wrong.') =>
  error?.response?.data?.message || error?.message || fallback;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try once to get a new access token with the refresh token.
// Concurrent 401s share the same refresh request.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response?.status !== 401 || !original || original._retried || !refreshToken) {
      return Promise.reject(error);
    }
    original._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/users/refresh-token`, { refreshToken })
          .finally(() => { refreshPromise = null; });
      }
      const { data } = await refreshPromise;
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return api(original);
    }
    catch {
      clearSession();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    }
  }
);

export default api;
