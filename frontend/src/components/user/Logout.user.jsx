const handleLogout = () => {
  const username = localStorage.getItem('username');

  // Clear tokens from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');

  // Log logout success with the username
  console.log(`Logout Success: ${username} has been logged out.`);

  // Redirect to the login page
  navigate('/login');
};

export default handleLogout;
