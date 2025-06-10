import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PublishIcon from '@mui/icons-material/Publish';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { motion } from 'framer-motion';

import image_1 from '../Images_Used/image_1.png';
import image_2 from '../Images_Used/image_2.png';
import image_3 from '../Images_Used/image_3.png';
import image_4 from '../Images_Used/image_4.png';

const Layout = ({ children, currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userAvatar = currentUser?.avatar;
  const username = currentUser?.username;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Liked Videos', icon: <ThumbUpIcon />, path: '/likes/liked-videos' },
    { text: 'My Subscriptions', icon: <SubscriptionsIcon />, path: '/subscriptions/my-channels' },
    { text: 'Playlists', icon: <VideoLibraryIcon />, path: '/playlist' },
    { text: 'Publish Video', icon: <PublishIcon />, path: '/publish-video' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/stats' },
  ];

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      '&::-webkit-scrollbar': {
        width: '0px',
        backgroundColor: 'transparent'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }
      }
    }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0,0,0,0.5)', marginX: { xs: 0, md: '15px' }, marginY: {xs: 0, md: '10px'}, width: { xs: '100%', md: 'calc(100% - 30px)' }, boxShadow: '0 0px 6px rgba(0, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          {currentUser && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { md: 'none' }} }
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <motion.img
              src={image_1}
              alt="StreamingPlatform Logo"
              style={{ height: '40px', marginRight: '10px', filter: 'invert(1)' }}
              whileHover={{ rotate: 5 }}
            />
            <Typography variant="root" component="div" sx={{ color: 'text.primary', letterSpacing: '1px' }}>
              StreamingPlatform
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center',  position: 'fixed', flexDirection: 'column', right: '-1vw', top: '80vh', padding: '0px', zIndex: 1000 }}>
              <motion.a href="https://samp231004.github.io/Portfolio/" target='_blank' rel="noreferrer" whileHover={{ scale: 1.2 }}>
                <IconButton color="inherit" sx={{ mx: 1 }}>
                  <img src={image_2} alt="Portfolio" style={{ height: '24px', filter: 'invert(1)' }} />
                </IconButton>
              </motion.a>
              <motion.a href="https://www.linkedin.com/in/samp2310/" target='_blank' rel="noreferrer" whileHover={{ scale: 1.2 }}>
                <IconButton color="inherit" sx={{ mx: 1 }}>
                  <img src={image_3} alt="LinkedIn" style={{ height: '24px', filter: 'invert(1)' }} />
                </IconButton>
              </motion.a>
              <motion.a href="https://github.com/SamP231004" target='_blank' rel="noreferrer" whileHover={{ scale: 1.2 }}>
                <IconButton color="inherit" sx={{ mx: 1 }}>
                  <img src={image_4} alt="GitHub" style={{ height: '24px', filter: 'invert(1)' }} />
                </IconButton>
              </motion.a>
            </div>
            {currentUser ? (
              <>
                <Avatar src={userAvatar} alt={username} sx={{ ml: 2, mr: 1, border: '2px solid', borderColor: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ mr: 2, color: 'text.primary' }}>
                  {username}
                </Typography>
                <Button color="inherit" onClick={onLogout} startIcon={<ExitToAppIcon />} sx={{ color: 'text.secondary' }}>
                  Logout
                </Button>
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Permanent Sidebar for large screens */}
      {currentUser && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: 'background.paper', borderRight: '1px solid #333' },
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Box sx={{ p: 2}}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: 'text.primary' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      {/* Temporary Drawer for small screens */}
      {currentUser && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ display: { xs: 'block', md: 'none' } }}
          PaperProps={{ sx: { backgroundColor: 'background.paper' } }}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Toolbar />
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} onClick={() => navigate(item.path)} sx={{ color: 'text.primary' }}>
                  <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;