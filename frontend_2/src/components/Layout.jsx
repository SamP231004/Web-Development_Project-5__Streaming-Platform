import React from 'react';
import { useNavigate } from 'react-router-dom';

import image_1 from '../Images_Used/image_1.jpg';
import image_2 from '../Images_Used/image_2.png';
import image_3 from '../Images_Used/image_3.png';
import image_4 from '../Images_Used/image_4.png';

const Layout = ({ children, currentUser, onLogout }) => {
  const navigate = useNavigate();

  const userAvatar = currentUser?.data?.avatar;
  const username = currentUser?.data?.username;

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={image_1} alt="Error Loading Image" />
        </div>
        {currentUser && (
          <ul className="sidebar-menu header-menu">
            <li onClick={() => navigate('/')}>Home</li>
            <li onClick={() => navigate('/likes/liked-videos')}>Liked Videos</li>
            <li onClick={() => navigate('/publish-video')}>Publish Video</li>
            <li onClick={() => navigate('/dashboard/stats')}>Dashboard</li>
            <li onClick={onLogout}>Logout</li>
          </ul>
        )}
        <div className="contact">
          <a
            href="https://samp231004.github.io/Portfolio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image_2} alt="Error Loading Image" />
          </a>
          <a
            href="https://www.linkedin.com/in/samp2310/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image_3} alt="Error Loading Image" />
          </a>
          <a
            href="https://github.com/SamP231004"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image_4} alt="Error Loading Image" />
          </a>
        </div>
        <div className="contact2">
          <a
            href="mailto:samp231004@gmail.com"
            className="contact2"
            aria-label="Email me at samp231004@gmail.com"
          >
            samp231004@gmail.com
          </a>
        </div>
        {currentUser && (
          <div className="user-info content-user-info">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={`${username}'s avatar`}
                className="avatar-image"
              />
            ) : (
              <div className="placeholder-avatar">No Avatar</div>
            )}
            <h2>{username || 'Guest'}</h2>
          </div>
        )}
      </div>
      <div className="dashboard-container">
        <main className="content">{children}</main>
      </div>
    </>
  );
};

export default Layout;