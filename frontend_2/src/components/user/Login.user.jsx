import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('one@one.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://streamingplatformbackend.onrender.com/api/version_1/users/login',
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('username', user.username);
        localStorage.setItem('avatar', user.avatar);

        console.log('Login Success:', response.data.message);
        console.log('User Details:', user);
        console.log('User ID:', user._id);
        console.log('User Email:', user.email);

        navigate('/'); // Navigate to homepage
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  return (
    <div className="LoginContainer">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="btn-login">
        Login
      </button>
    </div>
  );
};

export default Login;