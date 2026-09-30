import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Drawer, List,
  ListItemButton, ListItemText, ListItemIcon, Tooltip, Menu, MenuItem, Divider, InputBase,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { motion } from 'framer-motion';

import image_1 from '../Images_Used/image_1.png';
import image_2 from '../Images_Used/image_2.png';
import image_3 from '../Images_Used/image_3.png';
import image_4 from '../Images_Used/image_4.png';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const navSections = [
  {
    items: [
      { text: 'Home', icon: HomeOutlinedIcon, activeIcon: HomeIcon, path: '/' },
      { text: 'Subscriptions', icon: SubscriptionsOutlinedIcon, activeIcon: SubscriptionsIcon, path: '/subscriptions/my-channels' },
    ],
  },
  {
    title: 'You',
    items: [
      { text: 'Liked videos', icon: ThumbUpOutlinedIcon, activeIcon: ThumbUpIcon, path: '/likes/liked-videos' },
      { text: 'Playlists', icon: VideoLibraryOutlinedIcon, activeIcon: VideoLibraryIcon, path: '/playlist' },
    ],
  },
  {
    title: 'Studio',
    items: [
      { text: 'Upload video', icon: FileUploadOutlinedIcon, activeIcon: FileUploadIcon, path: '/publish-video' },
      { text: 'Dashboard', icon: InsightsOutlinedIcon, activeIcon: InsightsIcon, path: '/dashboard/stats' },
    ],
  },
];

const socialLinks = [
  { href: 'https://samp231004.github.io/Portfolio/', icon: image_2, label: 'Portfolio' },
  { href: 'https://www.linkedin.com/in/samp2310/', icon: image_3, label: 'LinkedIn' },
  { href: 'https://github.com/SamP231004', icon: image_4, label: 'GitHub' },
];

const SocialLinks = ({ direction = 'row' }) => (
  <Box sx={{ display: 'flex', flexDirection: direction, gap: 0.5 }}>
    {socialLinks.map(({ href, icon, label }) => (
      <Tooltip key={label} title={label} placement={direction === 'row' ? 'top' : 'left'}>
        <IconButton component={motion.a} href={href} target="_blank" rel="noreferrer" aria-label={label} size="small" whileHover={{ scale: 1.12 }}>
          <img src={icon} alt="" style={{ height: 18, filter: 'invert(1)', opacity: 0.7 }} />
        </IconButton>
      </Tooltip>
    ))}
  </Box>
);

const Sidebar = ({ pathname, onNavigate }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 1.5, py: 1.5 }}>
    {navSections.map((section, index) => (
      <Box key={section.title || index}>
        {index > 0 && <Divider sx={{ my: 1.5, mx: 1.5 }} />}
        {section.title && (
          <Typography sx={{ px: 1.5, pb: 0.75, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {section.title}
          </Typography>
        )}
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {section.items.map(({ text, icon: Icon, activeIcon: ActiveIcon, path }) => {
            const selected = pathname === path;
            return (
              <ListItemButton
                key={path}
                selected={selected}
                onClick={() => onNavigate(path)}
                sx={{
                  position: 'relative',
                  borderRadius: 2.5,
                  minHeight: 42,
                  px: 1.5,
                  color: selected ? 'text.primary' : 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)', color: 'text.primary' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.11)' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -12,
                      top: 10,
                      bottom: 10,
                      width: 3,
                      borderRadius: '0 3px 3px 0',
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: selected ? 'primary.main' : 'inherit' }}>
                  {selected ? <ActiveIcon fontSize="small" /> : <Icon fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: selected ? 600 : 500 }} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    ))}

    <Box sx={{ mt: 'auto', pt: 2, px: 1 }}>
      <SocialLinks />
      <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mt: 1, px: 0.5 }}>
        © {new Date().getFullYear()} StreamingPlatform
      </Typography>
    </Box>
  </Box>
);

const SearchBar = ({ autoFocus, onDone }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(urlQuery);

  useEffect(() => setValue(urlQuery), [urlQuery]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
    onDone?.();
  };

  const clear = () => {
    setValue('');
    if (urlQuery) navigate('/');
  };

  return (
    <Box
      component="form"
      role="search"
      onSubmit={submit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 560,
        height: 42,
        pl: 2,
        pr: 0.5,
        borderRadius: 999,
        bgcolor: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'border-color 0.2s, background-color 0.2s',
        '&:focus-within': { borderColor: 'rgba(0, 212, 255, 0.6)', bgcolor: 'rgba(255, 255, 255, 0.08)' },
      }}
    >
      <InputBase
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search videos and channels"
        autoFocus={autoFocus}
        inputProps={{ 'aria-label': 'Search videos' }}
        sx={{ flexGrow: 1, fontSize: '0.95rem' }}
      />
      {value && (
        <IconButton size="small" onClick={clear} aria-label="Clear search">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton type="submit" aria-label="Search" sx={{ ml: 0.5, bgcolor: 'rgba(255,255,255,0.06)', width: 34, height: 34 }}>
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const Layout = ({ children, currentUser, onLogout, fullBleed = false }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setAccountAnchor(null);
    onLogout();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(8, 8, 8, 0.75)',
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ minHeight: `${HEADER_HEIGHT}px !important`, gap: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 2.5 } }}>
          {currentUser && mobileSearchOpen ? (
            <>
              <IconButton onClick={() => setMobileSearchOpen(false)} aria-label="Close search">
                <CloseIcon />
              </IconButton>
              <SearchBar autoFocus onDone={() => setMobileSearchOpen(false)} />
            </>
          ) : (
            <>
              {currentUser && (
                <IconButton color="inherit" aria-label="Open navigation" edge="start" onClick={() => setDrawerOpen(true)} sx={{ display: { md: 'none' } }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Box
                component="button"
                onClick={() => navigate('/')}
                aria-label="Go to home"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, bgcolor: 'transparent', border: 0, p: 0, cursor: 'pointer', color: 'inherit', minWidth: { md: SIDEBAR_WIDTH - 20 } }}
              >
                <motion.img src={image_1} alt="" style={{ height: 28, filter: 'invert(1)' }} whileHover={{ rotate: 8 }} />
                <Typography variant="root" component="span" sx={{ color: 'text.primary', letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: { xs: '1rem', sm: '1.2rem' }, '@media (max-width: 380px)': { display: 'none' } }}>
                  Streaming<Box component="span" sx={{ color: 'primary.main' }}>Platform</Box>
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {currentUser && (
                  <Box sx={{ width: '100%', display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
                    <SearchBar />
                  </Box>
                )}
              </Box>

              {currentUser && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
                  <IconButton aria-label="Search" onClick={() => setMobileSearchOpen(true)} sx={{ display: { sm: 'none' } }}>
                    <SearchIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<VideoCallOutlinedIcon />}
                    onClick={() => navigate('/publish-video')}
                    sx={{
                      display: { xs: 'none', sm: 'inline-flex' },
                      borderRadius: 999,
                      px: 2,
                      py: 0.5,
                      borderColor: 'rgba(255,255,255,0.18)',
                      boxShadow: 'none',
                      '&:hover': { borderColor: 'rgba(255,255,255,0.35)', bgcolor: 'rgba(255,255,255,0.06)', boxShadow: 'none' },
                    }}
                  >
                    Upload
                  </Button>
                  <Tooltip title="Account">
                    <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.25 }}>
                      <Avatar src={currentUser.avatar} alt={currentUser.username} sx={{ width: 36, height: 36, border: '2px solid', borderColor: 'rgba(255,65,54,0.8)' }}>
                        {currentUser.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={accountAnchor}
                    open={!!accountAnchor}
                    onClose={() => setAccountAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 240 } } }}
                  >
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Avatar src={currentUser.avatar} alt={currentUser.username}>{currentUser.username?.[0]?.toUpperCase()}</Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 600 }}>{currentUser.fullName || currentUser.username}</Typography>
                        <Typography variant="body2" noWrap>@{currentUser.username}</Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { setAccountAnchor(null); navigate('/dashboard/stats'); }}>
                      <ListItemIcon><InsightsOutlinedIcon fontSize="small" /></ListItemIcon>
                      Your channel
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                      Log out
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Logged out there's no sidebar, so the social links float instead */}
      {!currentUser && (
        <Box
          sx={{
            position: 'fixed',
            right: 12,
            bottom: 24,
            zIndex: 1000,
            display: { xs: 'none', sm: 'flex' },
            p: 0.5,
            borderRadius: 3,
            bgcolor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <SocialLinks direction="column" />
        </Box>
      )}

      {currentUser && (
        <>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: SIDEBAR_WIDTH,
                top: HEADER_HEIGHT,
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
                boxSizing: 'border-box',
                bgcolor: 'rgba(8, 8, 8, 0.55)',
                backgroundImage: 'none',
                backdropFilter: 'blur(16px)',
                border: 0,
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 0,
              },
            }}
          >
            <Sidebar pathname={pathname} onNavigate={handleNavigate} />
          </Drawer>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ display: { xs: 'block', md: 'none' } }}
            PaperProps={{ sx: { width: 264, bgcolor: '#0E0E0E', backgroundImage: 'none', borderRadius: 0 } }}
          >
            <Toolbar sx={{ minHeight: `${HEADER_HEIGHT}px !important` }} />
            <Sidebar pathname={pathname} onNavigate={handleNavigate} />
          </Drawer>
        </>
      )}

      <Box
        component="main"
        sx={fullBleed ? { flexGrow: 1, minWidth: 0 } : {
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, lg: 4 },
          pt: `${HEADER_HEIGHT + 24}px`,
          pb: 8,
        }}
      >
        <Box sx={fullBleed ? undefined : { maxWidth: 1800, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
