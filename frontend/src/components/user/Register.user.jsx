import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const response = await axios.post('https://streamingplatformbackend.onrender.com/api/version_1/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Registration Success:', response.data.message);
        console.log('User Details:', user);
        window.location.href = '/';
      }
    } 
    catch (error) {
      if (error.response) {
        console.error('Registration Failed:', error.response.data);
        alert(`Registration Failed: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='RegisterContainer'>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <label><center>Upload Avatar</center></label>
        <input
          type="file"
          accept="image/*"
          placeholder='Select Cover Image'
          onChange={(e) => setCoverImage(e.target.files[0])}
        />
        <label><center>Upload Cover Image (optional)</center></label>

        <button type="submit" className='btn-login register-btn'>Register</button>
      </form>
    </div>
  );
};

export default Register;